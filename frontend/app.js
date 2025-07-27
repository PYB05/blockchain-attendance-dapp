const contractAddress = "0xDD6a0ba90eFe04A484b0ccC451b61E6Da910763d";
const contractABI = [{
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "student",
        "type": "address"
      }
    ],
    "name": "addStudent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "attendance",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "day",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "student",
        "type": "address"
      }
    ],
    "name": "checkAttendance",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "day",
        "type": "uint256"
      }
    ],
    "name": "markAttendance",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "students",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "teacher",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

let signer;
let attendanceContract;
let currentUserAddress;

function displayResult(message, isSuccess) {
  const resultElement = document.getElementById('attendanceResult');
  resultElement.style.display = 'block';
  resultElement.innerHTML = `
    <i class="fas fa-${isSuccess ? 'check-circle' : 'exclamation-circle'}"></i>
    ${message}
  `;
  resultElement.className = isSuccess ? 'result success' : 'result error';
}

function updateWalletStatus(connected, address = '') {
  const statusElement = document.getElementById('walletStatus');
  const addressElement = document.getElementById('walletAddress');
  
  if (connected) {
    statusElement.className = 'status-indicator connected';
    const formattedAddress = `${address.substring(0, 6)}...${address.substring(38)}`;
    addressElement.textContent = `Connected: ${formattedAddress}`;
    currentUserAddress = address;
  } else {
    statusElement.className = 'status-indicator disconnected';
    addressElement.textContent = 'Wallet not connected';
    currentUserAddress = null;
  }
}

async function connectWallet() {
  if (typeof window.ethereum === 'undefined') {
    displayResult("<i class='fas fa-exclamation-triangle'></i> MetaMask not installed", false);
    return;
  }

  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    
    signer = provider.getSigner();
    attendanceContract = new ethers.Contract(contractAddress, contractABI, signer);
    currentUserAddress = accounts[0];
    
    updateWalletStatus(true, currentUserAddress);
    
    // Verify network
    const network = await provider.getNetwork();
    console.log(`Connected to ${network.name} (ChainID: ${network.chainId})`);
    
    displayResult("<i class='fas fa-check-circle'></i> Wallet connected", true);
    
  } catch (err) {
    console.error("Connection error:", err);
    displayResult(`<i class='fas fa-times-circle'></i> Connection failed: ${err.message}`, false);
  }
}

async function addStudent() {
  if (!attendanceContract) {
    displayResult("Please connect wallet first", false);
    return;
  }

  const studentAddress = document.getElementById("studentAddress").value.trim();
  
  if (!ethers.utils.isAddress(studentAddress)) {
    displayResult("Invalid Ethereum address", false);
    return;
  }
  
  try {
    // Verify teacher status
    const teacherAddress = await attendanceContract.teacher();
    if (currentUserAddress.toLowerCase() !== teacherAddress.toLowerCase()) {
      throw new Error("Only teacher can add students");
    }

    displayResult("<i class='fas fa-spinner fa-spin'></i> Adding student...", true);
    
    const tx = await attendanceContract.addStudent(studentAddress);
    const receipt = await tx.wait();
    
    // Verify student was added
    const isStudent = await attendanceContract.students(studentAddress);
    if (!isStudent) {
      throw new Error("Student not added correctly");
    }
    
    displayResult(`<i class='fas fa-user-plus'></i> Student ${studentAddress.substring(0, 6)}... added`, true);
    console.log("Student added in block:", receipt.blockNumber);
    
  } catch (error) {
    console.error("Add student error:", error);
    displayResult(`<i class='fas fa-times-circle'></i> Error: ${error.message}`, false);
  }
}

async function markAttendance() {
  if (!attendanceContract) {
    displayResult("Please connect wallet first", false);
    return;
  }

  const day = document.getElementById("dayInput").value;
  
  if (!day || isNaN(day) || day < 1) {
    displayResult("Invalid day number", false);
    return;
  }
  
  try {
    displayResult("<i class='fas fa-spinner fa-spin'></i> Marking attendance...", true);
    
    const tx = await attendanceContract.markAttendance(day);
    const receipt = await tx.wait();
    
    // Verify attendance
    const isPresent = await attendanceContract.checkAttendance(day, currentUserAddress);
    if (!isPresent) {
      throw new Error("Attendance not recorded");
    }
    
    displayResult(`<i class='fas fa-calendar-check'></i> Marked present for day ${day}`, true);
    console.log("Attendance marked in block:", receipt.blockNumber);
    
  } catch (error) {
    console.error("Mark attendance error:", error);
    displayResult(`<i class='fas fa-times-circle'></i> Error: ${error.message}`, false);
  }
}

async function checkAttendance() {
  if (!attendanceContract) {
    displayResult("Please connect wallet first", false);
    return;
  }

  const day = document.getElementById("checkDay").value;
  const student = document.getElementById("checkStudent").value.trim();
  
  if (!day || isNaN(day) || day < 1) {
    displayResult("Invalid day number", false);
    return;
  }
  
  if (!ethers.utils.isAddress(student)) {
    displayResult("Invalid Ethereum address", false);
    return;
  }
  
  try {
    displayResult("<i class='fas fa-spinner fa-spin'></i> Checking...", true);
    
    // Check registration
    const isStudent = await attendanceContract.students(student);
    if (!isStudent) {
      throw new Error("Address not registered as student");
    }

    // Check attendance
    const present = await attendanceContract.checkAttendance(day, student);
    const shortAddress = `${student.substring(0, 6)}...${student.substring(38)}`;
    
    if (present) {
      displayResult(`<i class='fas fa-user-check'></i> ${shortAddress} present on day ${day}`, true);
    } else {
      displayResult(`<i class='fas fa-user-times'></i> ${shortAddress} absent on day ${day}`, false);
    }
    
  } catch (error) {
    console.error("Check attendance error:", error);
    displayResult(`<i class='fas fa-times-circle'></i> Error: ${error.message}`, false);
  }
}

// Debugging tools
window.debugAttendance = async (day, student) => {
  if (!attendanceContract) {
    console.error("Contract not loaded");
    return;
  }
  
  console.group("Debug Info");
  console.log("Current user:", currentUserAddress);
  console.log("Teacher:", await attendanceContract.teacher());
  
  if (student) {
    console.log("Is student registered?", await attendanceContract.students(student));
    console.log(`Attendance for day ${day}:`, await attendanceContract.checkAttendance(day, student));
  }
  console.groupEnd();
};