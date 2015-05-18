"use strict";


function Grid ( ){
   
 this.height=9;
 this.width=9;
 this.square=[];
 this.changes=0;
 
   var x, y;
   for (x=1; x<=9; x+=1)
   {
      this.square[x]=[];
         for (y=1; y<=9; y+=1)
         {
            this.square[x][y]= new Square(x,y);  
             this.square[x][y].populate();
         };
   };
   
   
   
};

Grid.prototype.display = function()
{ 
     document.write ('<br>');
     document.write ('<br>');
   var x, y;
   for (y=9; y>=1; y-=1)
   {
      for (x=1; x<=9; x+=1)
          {
          document.write (this.square[x][y].value+"   ")
          };
      document.write ('<br>');
   };
   
}

Grid.prototype.assign = function(x, y, value)
{
    if (!this.square[x][y].solved)
    {
        this.square[x][y].solve(value);
    }
}
//eliminate a number from non-solved squares in a row
Grid.prototype.rowElim = function (x, y, value)
{
  for (var i=1; i<=9; i++)
  {
    if(this.rowPoint(x, y)[i].eliminate(value))
    {
     this.changes+=1 
    }
  }
  
/*  var x;
    for (x=1; x<=9; x+=1)
    {
        if(this.square[x][y].eliminate(value))
        {
           this.changes+=1;
        };
    
     };*/
}

Grid.prototype.columnElim = function (x, y, value)
{
  for (var i=1; i<=9; i++)
  {if(this.columnPoint(x, y)[i].eliminate(value))
  {
   this.changes+=1; 
  }
  } /*var y;
    for (y=1; y<=9; y+=1)
    {
        if(this.square[x][y].eliminate(value))
          {
            this.changes+=1;
          };
    };
    
    */
}

Grid.prototype.boxElim = function (x, y, value)
{
  for (var i=1; i<=9; i++)
  {
    if(this.boxPoint(x, y)[i].eliminate(value))
      {
       this.changes+=1; 
      } 
  }
}
//returns # of squares a value is still valid on within a box or row of 9 squares 
Grid.prototype.countNotSolved = function (arrayOfNine, value)
{
  var counting=0;
  for (var i=1; i<=9; i++)
  {
    if(arrayOfNine[i].numbers[value] && !arrayOfNine[i].solved)
       {
         counting +=1
       }
  }
   return counting;
}
//if a square is solvable by only 1 left in a 9 set, solve . Line+box elimination. 
Grid.prototype.solvable = function (x, y)  
{
 for (var value=1; value <=9; value++)
 {
  
    if (this.countNotSolved(this.rowPoint(x,y), value)===1 && this.square[x][y].numbers[value] && !this.square[x][y].solved) 
   {
    this.square[x][y].solve(value);
    this.changes+=1;
      return true;
   }
   else if (this.countNotSolved(this.columnPoint(x,y), value)===1 && this.square[x][y].numbers[value] && !this.square[x][y].solved) 
   {
    this.square[x][y].solve(value);
    this.changes+=1;
      return true;
   }
   else if (this.countNotSolved(this.boxPoint(x,y), value)===1 && this.square[x][y].numbers[value] && !this.square[x][y].solved) 
   {
    this.square[x][y].solve(value);
    this.changes+=1;
      return true;
   };
    
    
 }
}

//trying to do a naked pair elimination method
Grid.prototype.nakedPair = function(x,y)
{
 if (!this.square[x][y].solved && this.square[x][y].count()===2)
     {
        var i;
        for (i=1; i<=9; i+=1)
        {
           if ((this.rowPoint(x,y)[i].numbers===this.square[x][y].numbers) && !(this.rowPoint(x,y)[i]===this.square[x][y]))
           {
              this.rowPoint(x,y)[i].protect=true;
              this.square[x][y].protect=true;
              this.rowElim(x,y);
              this.rowPoint(x,y)[i].protect=false;
              this.square[x][y].protect=false;              
           }
        }
        for (i=1; i<=9; i+=1)
        {
           if ((this.columnPoint(x,y)[i].numbers===this.square[x][y].numbers) && !(this.columnPoint(x,y)[i]===this.square[x][y]))
           {
              this.columnPoint(x,y)[i].protect=true;
              this.square[x][y].protect=true;
              this.columnElim(x,y);
              this.columnPoint(x,y)[i].protect=false;
              this.square[x][y].protect=false;              
           }
        }
        for (i=1; i<=9; i+=1)
        {
           if ((this.boxPoint(x,y)[i].numbers===this.square[x][y].numbers) && !(this.boxPoint(x,y)[i]===this.square[x][y]))
           {
              this.boxPoint(x,y)[i].protect=true;
              this.square[x][y].protect=true;
              this.boxElim(x,y);
              this.boxPoint(x,y)[i].protect=false;
              this.square[x][y].protect=false;              
           }
        }
      
     }
}

//find lines w/in a box where a value must exclusively be to eliminate along that row or column.
Grid.prototype.lines = function (x, y)
{
   var forNow =[];
   for (var i=1; i<=9; i++)//checking values 1 through 9
   {
      for (var j = 1; j <=9; j++)//boxes 1 through 9
      {
         forNow[j] = this.boxPoint(x,y)[j].checkVal(i);
      }
      if (this.inBoxRowsBot(forNow))
      {
         for (var z=1; z<=3; z++)
         {
            this.boxPoint(x,y)[z].protect=true;
           
         }
         this.rowElim( this.boxPoint(x,y)[1].xValue, this.boxPoint(x,y)[1].yValue, i);
         for (var z=1; z<=3; z++)
         {
            this.boxPoint(x,y)[z].protect=false;
           
         }
      };
      if (this.inBoxRowsMid(forNow))
      {
         for (var z=4; z<=6; z++)
         {
            this.boxPoint(x,y)[z].protect=true;  
         }
         this.rowElim(this.boxPoint(x,y)[4].xValue, this.boxPoint(x,y)[4].yValue, i);
         for (var z=4; z<=6; z++)
         {
            this.boxPoint(x,y)[z].protect=false;  
         }
      };
      if (this.inBoxRowsTop(forNow))
      {
         for (var z=7; z<=9; z++)
         {
            this.boxPoint(x,y)[z].protect=true;  
         }
         this.rowElim(this.boxPoint(x,y)[7].xValue, this.boxPoint(x,y)[7].yValue, i);
         for (var z=7; z<=9; z++)
         {
            this.boxPoint(x,y)[z].protect=false;  
         }
      };
      if (this.inBoxColLeft(forNow))
      {
         for (var z=0 ; z<3; z++)
         {
            this.boxPoint(x,y)[3*z+1].protect=true;
         }
         this.columnElim(this.boxPoint(x,y)[1].xValue, this.boxPoint(x,y)[1].yValue, i);
         for (var z=0 ; z<3; z++)
         {
            this.boxPoint(x,y)[3*z+1].protect=false;
         }
      };
      
      if (this.inBoxColMid(forNow))
      {
         for (var z=0 ; z<3; z++)
         {
            this.boxPoint(x,y)[3*z+2].protect=true;
         }
         this.columnElim(this.boxPoint(x,y)[2].xValue, this.boxPoint(x,y)[2].yValue, i);
         for (var z=0 ; z<3; z++)
         {
            this.boxPoint(x,y)[3*z+2].protect=false;
         }
         
      };   
   
      if (this.inBoxColRight(forNow))
      {
         for (var z=0 ; z<3; z++)
         {
            this.boxPoint(x,y)[3*z+3].protect=true;
         }
         this.columnElim(this.boxPoint(x,y)[3].xValue, this.boxPoint(x,y)[3].yValue, i);
         for (var z=0 ; z<3; z++)
         {
            this.boxPoint(x,y)[3*z+3].protect=false;
         }
         
      } ;  
   }
}

// returns true if boxes 4-9 are false
Grid.prototype.inBoxRowsBot = function (squarez)
{
   return !(squarez[4] || squarez [5] || squarez [6] || squarez[7] || squarez [8] || squarez [9])
}

Grid.prototype.inBoxRowsMid = function (squarez)
{
   return !(squarez[1] || squarez [2] || squarez [3] || squarez[7] || squarez [8] || squarez [9])
}

Grid.prototype.inBoxRowsTop = function (squarez)
{
   return !(squarez[1] || squarez [2] || squarez [3] || squarez[4] || squarez [5] || squarez [6])
}

Grid.prototype.inBoxColLeft = function (squarez)
{
   return !(squarez[2] || squarez [5] || squarez [8] || squarez[3] || squarez [6] || squarez [9])  
}

Grid.prototype.inBoxColMid = function (squarez)
{
   return!(squarez[1] || squarez [4] || squarez [7] || squarez[3] || squarez [6] || squarez [9])  
}

Grid.prototype.inBoxColRight = function (squarez)
{
   return !(squarez[1] || squarez [4] || squarez [7] || squarez[2] || squarez [5] || squarez [8])  
}

Grid.prototype.lineBlockRow = function(blocknum) {
   var boolNums =[0]; // booleans with T/F of a value's possibility in squares. 0 placeholder for [0] index
   var tempArr = [0]; // array of the squares in blocks we're checking.
   for (var i=1; i<=9; i++) //checking values 1 through 9
   {

      tempArr=this.blockPoint(blocknum);

      for (var j=1; j<=27; j+=1){
         boolNums[j]=tempArr[j].checkVal(i)
      };
        
      if (this.twoBox1(boolNums))
      {
         
          this.protectBlock(tempArr, 13, 18);
          this.protectBlock(tempArr, 22, 27);
          this.blockRowElim(tempArr, 2, i);
          this.blockRowElim(tempArr, 3, i);
          this.protectBlock(tempArr, 13, 18);
          this.protectBlock(tempArr, 22, 27);
      };
      if (this.twoBox2(boolNums)){
          this.protectBlock(tempArr, 4, 9);
          this.protectBlock(tempArr, 22, 27);
          this.blockRowElim(tempArr, 1, i);
          this.blockRowElim(tempArr, 3, i);
          this.protectBlock(tempArr, 4, 9);
          this.protectBlock(tempArr, 22, 27);
      };
      if (this.twoBox3(boolNums)){
          this.protectBlock(tempArr, 4, 9);
          this.protectBlock(tempArr, 13, 18);
          this.blockRowElim(tempArr, 1, i);
          this.blockRowElim(tempArr, 2, i);
          this.protectBlock(tempArr, 4, 9);  
          this.protectBlock(tempArr, 13, 18);
      };
      if (this.twoBox4(boolNums)){
          this.protectBlock(tempArr, 10, 12);
          this.protectBlock(tempArr, 16,18);
          this.protectBlock(tempArr, 19, 21);
          this.protectBlock(tempArr, 25, 27);
          this.blockRowElim(tempArr, 2, i);
          this.blockRowElim(tempArr, 3, i);
          this.protectBlock(tempArr, 10, 12);
          this.protectBlock(tempArr, 16,18);
          this.protectBlock(tempArr, 19, 21);
          this.protectBlock(tempArr, 25, 27); 
      };
      if (this.twoBox5(boolNums)){
          this.protectBlock(tempArr, 1, 3);
          this.protectBlock(tempArr, 7, 9);
          this.protectBlock(tempArr, 19, 21);
          this.protectBlock(tempArr, 25, 27);
          this.blockRowElim(tempArr, 1, i);
          this.blockRowElim(tempArr, 3, i);
          this.protectBlock(tempArr, 1, 3);
          this.protectBlock(tempArr, 7, 9);
          this.protectBlock(tempArr, 19, 21);
          this.protectBlock(tempArr, 25, 27);
      };
      if (this.twoBox6(boolNums)){
          this.protectBlock(tempArr, 1, 3);
          this.protectBlock(tempArr, 7, 9);
          this.protectBlock(tempArr, 10, 12);
          this.protectBlock(tempArr, 16,18);
          this.blockRowElim(tempArr, 1, i);
          this.blockRowElim(tempArr, 2, i);
          this.protectBlock(tempArr, 1, 3);
          this.protectBlock(tempArr, 7, 9);
          this.protectBlock(tempArr, 10, 12);
          this.protectBlock(tempArr, 16,18);
      };
      if (this.twoBox7(boolNums)){
          this.protectBlock(tempArr, 10, 15);
          this.protectBlock(tempArr, 19, 24);
          this.blockRowElim(tempArr, 2, i);
          this.blockRowElim(tempArr, 3, i);
          this.protectBlock(tempArr, 10, 15);
          this.protectBlock(tempArr, 19, 24);
          
      };
      if (this.twoBox8(boolNums)){
          this.protectBlock(tempArr, 1, 6);
          this.protectBlock(tempArr, 19, 24);  
          this.blockRowElim(tempArr, 1, i);
          this.blockRowElim(tempArr, 3, i);
          this.protectBlock(tempArr, 1, 6);
          this.protectBlock(tempArr, 19, 24);  

      };
      if (this.twoBox9(boolNums)){
          this.protectBlock(tempArr, 1, 6);
          this.protectBlock(tempArr, 10, 15);
          this.blockRowElim(tempArr, 1, i);
          this.blockRowElim(tempArr, 2, i);
          this.protectBlock(tempArr, 1, 6);
          this.protectBlock(tempArr, 10, 15);
      };
   }
}



Grid.prototype.elimPass = function ()
{
   var x, y;
   for (y=1; y<=9; y+=1)
   {
      for (x=1; x<=9; x+=1)
      {
          if (this.square[x][y].solved)
          {
              var V= this.square[x][y].value;
              this.rowElim (x, y, V);
              this.columnElim (x, y, V);
              this.boxElim (x, y, V);
          };
      };
   };
       
}

Grid.prototype.SolvePass = function()
{
   var x, y;
   for (y=1; y<=9; y+=1)
   {
      for (x=1; x<=9; x+=1)
      {
          this.square[x][y].newSolve()
      };
   };
    
}
Grid.prototype.solvablePass = function()
{
   var x, y;
   for (y=1; y<=9; y+=1)
   {
      for (x=1; x<=9; x+=1)
      {
          if(this.solvable(x,y))
          {
           this.elimPass(); 
          }
      };
   };
   
   
}

Grid.prototype.linePass = function()
{
      var a, b;
   for (a=0; a<3; a++)
   {
      for (b=0; b<3; b+=1)
      {
          this.lines(3*a+1, 3*b+1);
      };
   };
   
}

Grid.prototype.pairPass = function()
{
    var x, y;
   for (y=1; y<=9; y+=1)
   {
      for (x=1; x<=9; x+=1)
      {
         this.nakedPair(x,y);
      }
   }
}

Grid.prototype.blockPass = function(){
   var block
   for (block=1; block<=6; block+=1){
      this.lineBlockRow(block)
   };
   
}

Grid.prototype.fullPass= function()
{
    do
    {
         this.changes=0;
         this.elimPass();
         this.SolvePass();
         this.elimPass();
         this.solvablePass();
         this.elimPass();
         this.linePass();
         this.elimPass();
         this.pairPass();
         this.elimPass();
         this.blockPass();
         this.elimPass();
       
    }
       
        while (this.changes>0);   
   

}

//returns an array (1-9) of the squares that occupy a specific row.

Grid.prototype.rowPoint = function (x, y)
{
  var tempArray = [];
  for (var i=1; i<=9; i++)
  {
    tempArray[i]=this.square[i][y]
  };
  return tempArray
  
}
// returns array of squares in a column 

Grid.prototype.columnPoint = function (x, y)
{
  var tempArray = [];
  for (var i=1; i<=9; i++)
  {
    tempArray[i]=this.square[x][i]
  };
  return tempArray
  
}

// returns array of squares in the corresponding box of a square.
Grid.prototype.boxPoint= function(x, y)
{
    var tempArray =[];
      
    var boxy = this.square[x][y].boxID(x,y);
    var a = (3*(boxy[0]-1));
    var b = (3*(boxy[1]-1));
    var i, j;
    for (i=1; i<=3; i++)
        {
            for (j=1; j<=3; j++)
            {
              tempArray[(3*(i-1)+j)]=this.square[a+j][b+i]
            }
        }
  return tempArray;
}

Grid.prototype.blockPoint=function(number)
{
   var tempyArray=[0];
   if (number > 0 && number <= 3){
      for (var i = 1; i<=3; i++){
         for (var j=1; j<=9; j++){
         tempyArray.push(this.rowPoint(1, i+3*(number-1))[j]);
           
            //forNow.push(this.rowPoint(1, Rownum)[k].checkVal(i));
         }
      }
      return tempyArray;
   }
   if (number > 3 && number <=6){
      for (var i = 1; i<=3; i++){
         for (var j=1; j<=9; j++){
         tempyArray.push(this.columnPoint(i+3*(number-4), 1)[j]);
         }
      }
      return tempyArray;
   }
   
}

Grid.protectBlock = function (tempzArray, a, b){
   for (var i=a; i<=b; i++){
      tempzArray[i].toggleProtect()  
   }
      
}

Grid.blockRowElim = function (fedArray, a, value){
   for (var i=1; i<=9; i+=1){
      if(fedArray[i+9*(a-1)].eliminate(value)){
         this.changes+=1
      }
   }
   
   
}

Grid.prototype.twoBox1 = function (passedArray)
{
   !( passedArray[4] || passedArray[5] || passedArray[6] || passedArray[7] || passedArray[8] || passedArray[9] ) 
}
Grid.prototype.twoBox2 = function (passedArray)
{
   !( passedArray[13] || passedArray[14] || passedArray[15] || passedArray[16] || passedArray[17] || passedArray[18] ) 
}
Grid.prototype.twoBox3 = function (passedArray)
{
   !( passedArray[22] || passedArray[23] || passedArray[24] || passedArray[25] || passedArray[26] || passedArray[27] ) 
}
Grid.prototype.twoBox4 = function (passedArray)
{
   !( passedArray[1] || passedArray[2] || passedArray[3] || passedArray[7] || passedArray[8] || passedArray[9] ) 
}
Grid.prototype.twoBox5 = function (passedArray)
{
   !( passedArray[10] || passedArray[11] || passedArray[12] || passedArray[16] || passedArray[17] || passedArray[18] ) 
}
Grid.prototype.twoBox6 = function (passedArray)
{
   !( passedArray[19] || passedArray[20] || passedArray[21] || passedArray[25] || passedArray[26] || passedArray[27] ) 
}
Grid.prototype.twoBox7 = function (passedArray)
{
   !( passedArray[1] || passedArray[2] || passedArray[3] || passedArray[4] || passedArray[5] || passedArray[6] ) 
}
Grid.prototype.twoBox8 = function (passedArray)
{
   !( passedArray[10] || passedArray[11] || passedArray[12] || passedArray[13] || passedArray[14] || passedArray[15] ) 
}
Grid.prototype.twoBox9 = function (passedArray)
{
   !( passedArray[19] || passedArray[20] || passedArray[21] || passedArray[22] || passedArray[23] || passedArray[24] ) 
}



// callback functions use point, elim, as a callback function
//try using filter and map?
// 

  // function ElimnCallback (PointingFN, value){
	// [PointingFN].forEach(eliminate(value),)
	.eliminate(value);
	// }
	
	// var rowPoint1 = function (x,y)
// {
  // var tempArray = [];
  // for (var i=1; i<=9; i++)
  // {
    // tempArray[i]=G3.square[i][y]
  // };
  // return tempArray
  
// }

	
	
// var filterCallback = new function()	
