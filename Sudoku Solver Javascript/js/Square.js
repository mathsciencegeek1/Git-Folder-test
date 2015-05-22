"use strict";


function Square(x,y)
{   
   
   this.solved=false;
   this.numbers=[]; //possible values array, filled in to all true with .populate
   this.val=0;
    this.xValue= x;
    this.yValue= y;
   this.protect=false;
   
}
//fills in a square's numbers array with true for all possible numbers
Square.prototype.populate = function ()
{
 var i;
 for (i=1; i<=9; i++){ 
    this.numbers[i] = true;
 }
   
}

//Solve a square to one number. All other possibilites set to false. Bool .solved true to indicate it has been solved. 
Square.prototype.solve= function (numb)
{
   
   var i;
   for (i=1; i<=9; i+=1){ 
      this.numbers[i] = false;
   }
   this.numbers[numb] = true; 
   this.solved = true;
    this.val=numb;
   
 
            
}
//returns the number of possibilities left in a square's numbers array 
Square.prototype.count = function ()
{
   var i;
   var count=0;
   for (i=1; i<=9; i+=1)
   { 
      if (this.numbers[i] === true)
      {
       count+=1  
      };
   };
  return count;   
    
}


 //eliminate a value from the possibile numbers array within a square   
Square.prototype.eliminate = function (number)
{
    if (!this.solved && !this.protect && this.numbers[number])
    {
        this.numbers[number] = false;
        changes+=1;
        return true;
    }
    else 
    {
      return false;
    }
}   
  // gives a 3 unit coordinate to designate which "box" a square is in
Square.prototype.boxID = function (x ,y)
{
    var a= Math.floor((x+2)/3);
    var b= Math.floor((y+2)/3);  
    
    return [a,b];
};
//for when there is only 1 possible value left, returns the value that still has true
Square.prototype.solveValue = function ()
{
 return this.numbers.indexOf(true);
}
//When the square is ready to be solved, checks if it hasn't been solved yet
Square.prototype.newSolve = function ()
{
 if (!this.solved && this.count()===1)   
 {
  this.solve (this.solveValue());   
 }
    
}

//check whether a value is possible in this square.
Square.prototype.checkVal = function(value)
{
 return this.numbers[value];  
     
}

Square.prototype.toggleProtect = function ()
{
 this.protect = !this.protect   
}
