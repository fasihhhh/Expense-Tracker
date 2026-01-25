// import getdata from './api'

// -------------------------Chart Code from ----------------------


const xValues2 = ["Daily Limit", "Today's Spending"];
const yValues2 = [200, 100];
const barColors2 = ["grey", "red"];

new Chart("myChart2", {
  type: "doughnut",
  data: {
    labels: xValues2,
    datasets: [{
      backgroundColor: barColors2,
      data: yValues2
    }]
  },
  options: {
    title: {
      display: true,
      text: "World Wide Wine Production"
    }
  }
});

// -------------------------Chart Code from ----------------------
let BaseURL = 'http://127.0.0.1:3000';
// const userId = localStorage.getItem(userId)

let currentBalanceVariable = 0;

let accountId = "";
let userId = 2;


async function getData() {
    try {
        // let data = [];
        console.log("Fetching Data ... ")
        let userResponse = await fetch(`${BaseURL}/users/${userId}`);
        let userData = await userResponse.json();
        console.log("user "+JSON.stringify(userData))

        let accountResponse = await fetch(`${BaseURL}/accounts?userId=${userId}`);
        let accountData = await accountResponse.json();
        console.log("acc "+ JSON.stringify(accountData))
        userName.textContent = userData.name;
        accountId = accountData[0].id; 
        console.log("acc id "+accountId)
      
        let transactionResponse = await fetch(`${BaseURL}/transactions?accountId=${accountId}`);
        let transactionData = [...await transactionResponse.json()];
        // console.log("trans "+ JSON.stringify(transactionData[0]))

        // data = [...await response.json()]
        
        // console.log(response.json())
        let depositArray = transactionData.filter((i)=>{
            return i.type=='deposit'
        });
        let withdrawalArray = transactionData.filter((i)=>{
            return i.type=='withdrawal'
        });
        console.log(withdrawalArray)
        
        currentBalanceVariable = accountData[0].balance;
        // console.log(currentBalanceVariable)

        recentTransactions(transactionData)
        currentBalanceDisplay()
        chartUpdate(withdrawalArray)
    } catch (error) {
        console.log(error)
    }
}


getData();

function chartUpdate(withdrawalArray){
      const xValues = [];
      // console.log(withdrawalArray)
      const yValues = [];
      withdrawalArray.forEach((i)=>{
        xValues.push(i.description)
        yValues.push(Number(i.amount))
      })
      let xValuesSet = [...new Set(xValues)]
      console.log(yValues)
      console.log(xValuesSet)
      const barColors = ["red","blue","green","orange","brown","pink","yellow"];

      new Chart("myChart", {
        type: "pie",
        data: {
          labels: xValuesSet,
          datasets: [{
            backgroundColor: barColors,
            data: yValues
          }]
        },
        options: {
          title: {
            display: true,
            text: "Total Spending"
          }
        }
      });
}

function recentTransactions(transactionData){
  let lastWithdrawalVariable ='. . . ';
  let lastDepositVariable ='. . . ';
  recent_trans.innerHTML =''
  transactionData.forEach(element => {
    let time = new Date(element.createdAt)
    let eachTrans = document.createElement('div');
    eachTrans.className = 'each-transaction d-flex justify-content-between align-items-center py-3 px-1'
    if(element.type ==='withdrawal'){
                eachTrans.innerHTML =  `
                              <div class="descrption fs-13px text-start  w-25" >
                                  <p class="mb-0" id="transactions_title">${element.title}</p>
                              </div>
                              <div class="time fs-13px text-center w-25 d-none d-md-block">
                                  <p class="mb-0" id="transactions_time">${time.toLocaleTimeString()}<br>${time.toLocaleDateString()}</p>
                              </div>
                              <div class="amount text-end w-25 text-danger d-flex gap-2 justify-content-end align-items-center">
                                  <button class="btn btn-danger delete-btn" data-id="${element.id}" type="${element.type}" id="transactionDeleteBtn">Rollback</button>
                                  
                                  <p class="mb-0 w-25" id="transactions_amount" > -${element.amount}</p>
                              </div>
    `
                lastWithdrawalVariable = element.amount;
    }
    else if(element.type ==='deposit'){
                            eachTrans.innerHTML =  `
                              <div class="descrption fs-13px text-start  w-25" >
                                  <p class="mb-0" id="transactions_title">${element.title}</p>
                              </div>
                              <div class="time fs-13px text-center w-25 d-none d-md-block">
                                  <p class="mb-0" id="transactions_time">${time.toLocaleTimeString()}<br>${time.toLocaleDateString()}</p>
                              </div>
                              <div class="amount text-end w-25 text-success d-flex gap-2 justify-content-end align-items-center">
                                  <button class="btn btn-danger delete-btn" data-id="${element.id}"  type="${element.type}" id="transactionDeleteBtn">Rollback</button>
                                  <p class="mb-0 w-25" id="transactions_amount" >+${element.amount}</p>
                              </div>
    `
                lastDepositVariable = element.amount;
    }
    // console.log(element)
    recent_trans.prepend(eachTrans)

  });

  
    lastDeposit.textContent = lastDepositVariable;
    lastWithdrawal.textContent = lastWithdrawalVariable;


}

function currentBalanceDisplay(){
  currentBalance.textContent = currentBalanceVariable;
}


async function currentBalanceUpdate(currentBalanceVariable) {

    let response = fetch(`${BaseURL}/accounts/${accountId}`,{
      method:'PATCH',
      headers:{
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({
        balance : currentBalanceVariable
      })
    })
    currentBalanceDisplay()
    const updatedBalance = (await response).json
    console.log("Updated",updatedBalance)
}

async function addNewTransaction(amount,title,description,transactionType) {

  const newTransaction = {
      "accountId": `${accountId}`,
      "title": `${title}`,
      "amount": amount,
      "type": `${transactionType}`,
      "description": `${description}`,
      "createdAt": `${new Date().toISOString()}`
  }

  let response = fetch(`${BaseURL}/transactions?accountId=${accountId}`,{
    method : 'POST',
    headers: {
      'Content-Type' : 'application/json'
    },
    body: JSON.stringify(newTransaction)
  })

  const savedData = (await response).json
  console.log("saved",savedData);
  if(transactionType=='withdrawal'){
      currentBalanceVariable = currentBalanceVariable - parseFloat(amount);
  }
  else if(transactionType=='deposit'){
      currentBalanceVariable = currentBalanceVariable + parseFloat(amount);
  }
  currentBalanceUpdate(currentBalanceVariable,transactionType)
}


function validateTransaction(title,amount,description) {

  if (!title.trim()) {
    addDepositTitle.classList.add("is-invalid");
    return false;
  }

  if (!amount || amount <= 0) {
    addDepositAmount.classList.add("is-invalid");
    return false;
  }

  if (!description) {
    depositDescription.classList.add("is-invalid");
    return false;
  }

  return true;
}

async function deleteTransaction(transactionId,transactionType,withdrawaltransactionAmount,DeposittransactionAmount){


    await fetch(`${BaseURL}/transactions/${transactionId}`, {
      method: "DELETE"
    });
    console.log(transactionType)
    console.log(currentBalanceVariable)
    console.log("w "+typeof(withdrawaltransactionAmount))
    console.log("d "+DeposittransactionAmount)
    if(transactionType=='withdrawal'){
      currentBalanceVariable = currentBalanceVariable + withdrawaltransactionAmount;
    }
    else if(transactionType=='deposit'){
      currentBalanceVariable = currentBalanceVariable - DeposittransactionAmount;
    }
    currentBalanceUpdate(currentBalanceVariable)
    getData();

}

document.getElementById('withrawalSave').addEventListener('click',()=>{
    const amount = addWithdrawalAmount.value;
    const title = addWithdrawalTitle.value;
    const description = withdrawalDescription.value;
    const transactionType = 'withdrawal'
    // if(isNaN(amount)) return;
    if(amount>currentBalanceVariable) return;
    if (!validateTransaction(title, amount, description)) return;
    addNewTransaction(Number(amount),title,description,transactionType)
  
})

document.getElementById('depositSave').addEventListener('click',()=>{
    const amount = addDepositAmount.value;
    const title = addDepositTitle.value;
    const description = depositDescription.value;
    const transactionType = 'deposit'
    // if(isNaN(amount)) return;
    if (!validateTransaction(title, amount, description)) return;
    addNewTransaction(Number(amount),title,description,transactionType)
})
document.getElementById("downloadBtn").addEventListener("click", async () => {
  const { jsPDF } = window.jspdf;
  const element = document.getElementById("recent_trans");

  const canvas = await html2canvas(element, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const imgWidth = 210; // A4 width in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 10, imgWidth, imgHeight);
  pdf.save("transaction-statement.pdf");
});
let vvfg="";

    recent_trans.addEventListener('click',(e)=>{
      if(!e.target.classList.contains('delete-btn')) return;
      console.log(e.target.dataset.id)
      console.log(e.target.getAttribute('type'))
      console.log(e.target.nextElementSibling.textContent)
      vvfg= e.target.getAttribute('type');
      let transactionId = e.target.dataset.id;
      let transactionType = e.target.getAttribute('type');
      let DeposittransactionAmount = (e.target.nextElementSibling.textContent).replace('+',"");
      let withdrawaltransactionAmount = (e.target.nextElementSibling.textContent).replace('-',"");
      console.log("d "+DeposittransactionAmount)
      console.log("w "+withdrawaltransactionAmount)
      deleteTransaction(transactionId,transactionType,Number(withdrawaltransactionAmount),Number(DeposittransactionAmount))
      recentTransactions()
    })
