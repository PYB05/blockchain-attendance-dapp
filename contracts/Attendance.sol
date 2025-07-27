// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Attendance {
    address public teacher;
    mapping(address => bool) public students;
    mapping(uint => mapping(address => bool)) public attendance;

    constructor() {
        teacher = msg.sender;
    }

    function addStudent(address student) public {
        require(msg.sender == teacher, "Only teacher can add students");
        students[student] = true;
    }

    function markAttendance(uint day) public {
        require(students[msg.sender], "Not a registered student");
        attendance[day][msg.sender] = true;
    }

    function checkAttendance(uint day, address student) public view returns (bool) {
        return attendance[day][student];
    }
}
