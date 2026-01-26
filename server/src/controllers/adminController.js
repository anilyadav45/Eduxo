import College from "../models/College.js";
import Department from "../models/Department.js";
import Semester from "../models/Semester.js";
import Subject from "../models/Subject.js";
import { logAudit } from "../utils/AuditLogger.js";
import Attendance from "../models/Attendance.js";
import User from "../models/User.js";


const generateCollegeCode = (name) => {
  return name
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .slice(0, 6);
};

export const createCollege = async (req, res) => {
  try {
    const { name, address } = req.body;

    if (!name || !address) {
      return res.status(400).json({ message: "Name and address required" });
    }

    const existing = await College.findOne({ name });
    if (existing) {
      return res.status(409).json({ message: "College already exists" });
    }

    const code = generateCollegeCode(name);

    const college = await College.create({
      name,
      address,
      code,
      isActive: true,
      createdBy: req.user.id
    });


    await logAudit({
      req,
      action: "CREATE_COLLEGE",
      entity: "College",
      entityId: college._id,
      metadata: { name: college.name },
    });

    res.status(201).json(college);
  } catch (err) {
    console.error("Create college error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};


export const createDepartment = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Department name is required" });
    }

    let collegeId;

    // ✅ SUPER ADMIN can choose college
    if (req.user.role === "SUPER_ADMIN") {
      if (!req.body.college) {
        return res.status(400).json({ message: "College is required" });
      }
      collegeId = req.body.college;
    }

    // ✅ COLLEGE ADMIN always uses own college
    if (req.user.role === "COLLEGE_ADMIN") {
      if (!req.user.college) {
        return res.status(400).json({ message: "Admin has no college assigned" });
      }
      collegeId = req.user.college;
    }

    const department = await Department.create({
      name,
      college: collegeId,
    });

    res.status(201).json(department);
  } catch (err) {
    console.error("Create department error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const createSemester = async (req, res) => {
  try {
    const { name, department } = req.body;

    const dept = await Department.findById(department);
    if (!dept) {
      return res.status(400).json({ message: "Invalid department ID" });
    }

    // ✅ College isolation
    if (req.user.role === "COLLEGE_ADMIN") {
      if (String(req.user.college) !== String(dept.college)) {
        return res.status(403).json({
          message: "You cannot create semester for another college",
        });
      }
    }

    const semester = await Semester.create({
      name,
      department,
      college: dept.college   // 🔥 VERY IMPORTANT
    });

    res.status(201).json(semester);
  } catch (err) {
    console.error("Create semester error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



export const createSubject = async (req, res) => {
  try {
    const { name, semester } = req.body;

    const sem = await Semester.findById(semester).populate("department");
    if (!sem) {
      return res.status(400).json({ message: "Invalid semester ID" });
    }

    // ✅ College isolation
    if (req.user.role === "COLLEGE_ADMIN") {
      if (String(req.user.college) !== String(sem.department.college)) {
        return res.status(403).json({
          message: "You cannot create subject for another college",
        });
      }
    }

    const subject = await Subject.create({
      name,
      semester,
    });

    res.status(201).json(subject);
  } catch (err) {
    console.error("Create subject error:", err);
    res.status(500).json({ message: "Server error" });
  }
};




export const assignStudentSemester = async (req, res) => {
  try {
    const { studentId, semesterId } = req.body;

    if (!studentId || !semesterId) {
      return res.status(400).json({ message: "studentId and semesterId required" });
    }

    // logged in admin
    const admin = req.user;

    // student
    const student = await User.findById(studentId);
    if (!student || student.role !== "STUDENT") {
      return res.status(400).json({ message: "Invalid student" });
    }

    // semester
    const semester = await Semester.findById(semesterId).populate({
      path: "department",
      populate: { path: "college" }
    });

    if (!semester) {
      return res.status(400).json({ message: "Invalid semester" });
    }

    // 🔐 College isolation checks
    if (!student.college || student.college.toString() !== admin.college.toString()) {
      return res.status(403).json({ message: "Student not from your college" });
    }

    if (
      !semester.department ||
      !semester.department.college ||
      semester.department.college._id.toString() !== admin.college.toString()
    ) {
      return res.status(403).json({ message: "Semester not from your college" });
    }

    student.semester = semesterId;
    await student.save();

    res.json({ message: "Student assigned to semester successfully" });

  } catch (err) {
    console.error("Assign student semester error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//reports


export const getSemesterReport = async (req, res) => {
  try {
    const { semesterId } = req.params;

    const semester = await Semester.findById(semesterId).populate("department");
    if (!semester) {
      return res.status(400).json({ message: "Invalid semester" });
    }

    // College isolation
    if (String(semester.college) !== String(req.user.college)) {
      return res.status(403).json({ message: "Cross-college blocked" });
    }

    const attendance = await Attendance.find({ semester: semesterId })
      .populate("subject", "name")
      .populate("records.student", "name email");

    const stats = {};

    attendance.forEach((a) => {
      a.records.forEach((r) => {
        const id = r.student._id.toString();

        if (!stats[id]) {
          stats[id] = {
            student: r.student,
            total: 0,
            present: 0,
          };
        }

        stats[id].total++;
        if (r.status === "PRESENT") stats[id].present++;
      });
    });

    const report = Object.values(stats).map((s) => ({
      student: s.student,
      totalClasses: s.total,
      present: s.present,
      percentage:
        s.total === 0 ? 0 : Math.round((s.present / s.total) * 100),
    }));

    res.json({
      semester: semester.name,
      report,
    });

  } catch (err) {
    console.error("Semester report error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
