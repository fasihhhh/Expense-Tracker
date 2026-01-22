// import getdata from './api'

// -------------------------Chart Code from ----------------------
const xValues = ["Food", "Entertainment", "Loans/Debt", "Rent", "Others"];
const yValues = [55, 49, 44, 24, 15];
const barColors = ["red", "green","blue","orange","brown"];

new Chart("myChart", {
  type: "pie",
  data: {
    labels: xValues,
    datasets: [{
      backgroundColor: barColors,
      data: yValues
    }]
  },
  options: {
    title: {
      display: true,
      text: "World Wide Wine Production"
    }
  }
});

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
let URL = 'http://127.0.0.1:3000/transactions';

let data = []
async function getData() {
    try {
        let response = await fetch(URL);
        data = [...await response.json()]
        console.log(data)

        data.forEach(element => {
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
                                    <div class="amount text-end w-25 text-danger ">
                                        <p class="mb-0" id="transactions_amount" > -${element.amount}</p>
                                    </div>
          `
          }
          else{
                                  eachTrans.innerHTML =  `
                                    <div class="descrption fs-13px text-start  w-25" >
                                        <p class="mb-0" id="transactions_title">${element.title}</p>
                                    </div>
                                    <div class="time fs-13px text-center w-25 d-none d-md-block">
                                        <p class="mb-0" id="transactions_time">${time.toLocaleTimeString()}<br>${time.toLocaleDateString()}</p>
                                    </div>
                                    <div class="amount text-end w-25 text-success ">
                                        <p class="mb-0" id="transactions_amount" >+${element.amount}</p>
                                    </div>
          `
          }
          recent_trans.prepend(eachTrans)
          
        });

        function lastWithdrawalFunc() {
          let lastWithdrawalVariable;
            data.forEach(element => {
              if(element.type=='withdrawal'){
                 lastWithdrawalVariable = element;
              }
            });
            console.log(lastWithdrawalVariable)
            lastWithdrawal.textContent = lastWithdrawalVariable.amount;
            // console.log()
        }

        function lastDepositFunc() {
          let lastWithdrawalVariable;
            data.forEach(element => {
              if(element.type=='deposit'){
                 lastWithdrawalVariable = element;
              }
            });
            console.log(lastWithdrawalVariable)
            lastDeposit.textContent = lastWithdrawalVariable.amount;
            // console.log()
        }
        lastWithdrawalFunc()
        lastDepositFunc()
    } catch (error) {
        console.log(error)
    }
}
getData();



async function addNewTransaction(amount,title,description,transactionType) {

  const newTransaction = {
      "title": `${title}`,
      "amount": amount,
      "type": `${transactionType}`,
      "description": `${description}`,
      "createdAt": `${new Date().toISOString()}`
  }

  let response = fetch(URL,{
    method : 'POST',
    headers: {
      'Content-Type' : 'application/json'
    },
    body: JSON.stringify(newTransaction)
  })

  const savedData = (await response).json
  console.log("saved",savedData)
}

// addNewTransaction()


document.getElementById('withrawalSave').addEventListener('click',()=>{
  const amount = addWithdrawalAmount.value;
  const title = addWithdrawalTitle.value;
  const description = withdrawalDescription.value;
  const transactionType = 'withdrawal'
  if(isNaN(amount)) return;
  addNewTransaction(amount,title,description,transactionType)
  
})

document.getElementById('depositSave').addEventListener('click',()=>{
  console.log(depositDescription.value);
  console.log(addDepositTitle.value);
  console.log(addDepositAmount.value);
  const amount = addDepositAmount.value;
  const title = addDepositTitle.value;
  const description = depositDescription.value;
  const transactionType = 'deposit'
  if(isNaN(amount)) return;
  addNewTransaction(amount,title,description,transactionType)
})

