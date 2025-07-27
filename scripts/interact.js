const { ethers } = require("hardhat");

async function main() {
  const accounts = await ethers.getSigners(); // get all available accounts
  const teacher = accounts[0];
  const student = accounts[1];

  console.log("Teacher:", teacher.address);
  console.log("Student:", student.address);

  const contractAddress = "0xB7153004D841AFd69e177e9f3Ec96Ac7eF65a024"; // <- Make sure this is latest from deploy.js

  const attendance = await ethers.getContractAt("Attendance", contractAddress);

  const addTx = await attendance.connect(teacher).addStudent(student.address);
  await addTx.wait();
  console.log(`✅ Student added: ${student.address}`);

  const markTx = await attendance.connect(student).markAttendance(1);
  await markTx.wait();
  console.log("✅ Attendance marked for Day 1");

  const isPresent = await attendance.checkAttendance(1, student.address);
  console.log(`📅 Day 1 Attendance: ${isPresent}`);
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exitCode = 1;
});
