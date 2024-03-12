/**
 * Expense tracker
 * 
 * adding a new expense - /add-expense
 * post:expenses details
 * 
 * delete an expense -> /delete-expense
 * delete:id of the entry
 * 
 * updating an existing an one  -> /update-expense
 * patch:id of the entry,expense details
 * 
 * displaying existing records -> /get-expense
 * get
 */

/**
 * Database schema
 * amount, category, date
 */

const mongoose=require('mongoose')
const express=require('express')
const{Expense}=require('./schema.js')
const bodyParser=require('body-parser')
const cors=require('cors')

const app=express()
app.use(bodyParser.json())
app.use(cors())


async function connectToDb(){
 try{
    await mongoose.connect('mongodb+srv://Dhivya_23:Dhivya23@cluster0.c6inkef.mongodb.net/ExpenseTracker?retryWrites=true&w=majority&appName=Cluster0')
    console.log('DB connection established ;)')
    const port= process.env.PORT || 8000
    app.listen(port,function(){
        console.log(`Listening on port ${port}`)
    })

 }catch(error){
        console.log(error)
        console.log('Couldn/t established connection :(')
 }
}
connectToDb()

app.post('/add-expense', async function(request,response){
    const val=request.body
    console.log(val)
   try{
    await Expense.create({
        "amount":request.body.amount ,
        "category": request.body.category,
        "date": request.body.date

    })
    response.status(201).json({
        "status":"success",
        "message":"entry created"
    })
   }catch(error){
    response.status(500).json({
        "status":"failed",
        "message":"entry not created",
        "error":error
    })
   }
})

app.get('/get-expenses',async function(request,response){
    
    try{
        const expenseDetails=await Expense.find()
        response.status(200).json(expenseDetails)
    }catch(error){
        response.status(500).json({
            "status":"failed",
            "message":"could not fetch data",
            "error":error
        })

    }
})


//localhost:8000/delete-expense/65efdfb94a53129cc459930c
app.delete('/delete-expense/:id',async function(request,response){
  try{
    const expenseEntry=await Expense.findById(request.params.id)
  if(expenseEntry){
       await Expense.findByIdAndDelete(request.params.id)
       response.status(200).json({
        "status":"success",
        "message":"entry deleted"
       })
  }else{
    response.status(404).json({
        "status":"failed",
        "message":"entry not deleted"
    })
      
  }
  }catch(error){
    response.status(500).json({
        "status":"failed",
        "message":"could not delete data",
        "error":error
    })
  }
})



app.patch('/update-expense/:id',async function(request,response){
    try{
      const expenseEntry=await Expense.findById(request.params.id)
    if(expenseEntry){
        await expenseEntry.updateOne({
            "amount":request.body.amount,
            "category":request.body.category,
            "date":request.body.date
         })
         response.status(200).json({
          "status":"success",
          "message":"entry update"
         })
    }else{
      response.status(404).json({
          "status":"failed",
          "message":"entry not update"
      })
        
    }
    }catch(error){
      response.status(500).json({
          "status":"failed",
          "message":"could not update data",
          "error":error
      })
    }
  })
  
  
  
