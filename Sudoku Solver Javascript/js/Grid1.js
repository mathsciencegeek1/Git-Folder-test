"use strict";

var changes = 0
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
   //   document.write ('<br>');
   //   document.write ('<br>');
   // var x, y;
   // for (y=9; y>=1; y-=1)
   // {
   //    for (x=1; x<=9; x+=1)
   //        {
   //        document.write (this.square[x][y].value+"   ")
   //        };
   //    document.write ('<br>');
   // };
   document.write (this.gridDisplayString());
}


Grid.prototype.gridDisplayString = function(){
  var x,y; 
  var Puzzle="<br><br>"
  for (y=9; y>=1; y-=1){
    for (x=1; x<=9; x+=1){
      Puzzle=Puzzle.concat(this.square[x][y]["value"]+"&nbsp; &nbsp;")

    }
    Puzzle=Puzzle.concat("<br>");
  }
  return Puzzle
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
 
}
Grid.prototype.genElim = function (PointerArray, value){
  PointerArray.forEach(function(square){
    square.eliminate(value)})
} 

Grid.prototype.columnElim = function (x, y, value)
{
  for (var i=1; i<=9; i++){
    if(this.columnPoint(x, y)[i].eliminate(value)){
      this.changes+=1; 
    }
  } 
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
var countNotSolved = function (PointerArray, value){
  var whichsquares=[];
  for (var i=1; i<=9; i++){
    if (PointerArray[i].numbers[value] && !PointerArray[i].solved){
      whichsquares.push(i)
    }
  }
return whichsquares;
  // var remainingSqs=0;
  // PointerArray.forEach(function(square){
  //   if (square.numbers[value] && !square.solved){
  //     remainingSqs+=1
  //   }
  // });
  // return remainingSqs;
}
//if a square is solvable by only 1 left in a 9 set, solve . Line+box elimination. 
Grid.prototype.solvable = function (x, y)  
{
 for (var value=1; value <=9; value++)
 {
  
    if (countNotSolved(this.rowPoint(x,y), value).length===1 && this.square[x][y].numbers[value] && !this.square[x][y].solved) 
   {
    this.square[x][y].solve(value);
    this.changes+=1;
      return true;
   }
   else if (countNotSolved(this.columnPoint(x,y), value).length===1 && this.square[x][y].numbers[value] && !this.square[x][y].solved) 
   {
    this.square[x][y].solve(value);
    this.changes+=1;
      return true;
   }
   else if (countNotSolved(this.boxPoint(x,y), value).length===1 && this.square[x][y].numbers[value] && !this.square[x][y].solved) 
   {
    this.square[x][y].solve(value);
    this.changes+=1;
      return true;
   };
    
    
 }
}
//array of values left available to a square
var indicies = function (square){
  var allTrues = [];
  var idx=square["numbers"].indexOf(true);
  while (idx!=-1){
    allTrues.push(idx);
    idx= square.numbers.indexOf(true, idx+1);
  }
  return allTrues;
};
//trying to do a naked pair elimination method
Grid.prototype.nakedPair = function(x,y)
{
 if (!this.square[x][y].solved && this.square[x][y].count()===2){ //unsolved squares with only 2 possible numbers
    var box, row, col, val1, val2;
    box=this.boxPoint(x,y);
    row=this.rowPoint(x,y);
    col=this.columnPoint(x,y);


    for (var i=1; i<=9; i+=1){ // look for squares with matching pair of unsolved numbers that aren't the same square within row/column/box
                          //if a matching square is found, protect the two squares and do the matching row/column/box elimination on those values  
       if ((row[i].numbers.equals(this.square[x][y].numbers)) && !(row[i]===this.square[x][y]))
       {
          var vals = indicies(this.square[x][y]);
          var val1 = vals[0];
          var val2 = vals[1];    
          row[i].toggleProtect();
          this.square[x][y].toggleProtect();
          this.genElim(row, val1);
          this.genElim(row, val2);
          row[i].toggleProtect();
          this.square[x][y].toggleProtect();   
       }
    }
    for (var i=1; i<=9; i+=1){
       if ((col[i].numbers.equals(this.square[x][y].numbers)) && !(col[i]===this.square[x][y]))
       {
          var vals = indicies(this.square[x][y]);
          var val1 = vals[0];
          var val2 = vals[1];    
          col[i].toggleProtect();
          this.square[x][y].toggleProtect();
          this.genElim(col, val1);
          this.genElim(col, val2);
          col[i].toggleProtect();
          this.square[x][y].toggleProtect(); 
       }
    }
    for (var i=1; i<=9; i+=1){
      if ((box[i].numbers.equals(this.square[x][y].numbers)) && !(box[i]===this.square[x][y])){
        var vals = indicies(this.square[x][y]);
        var val1 = vals[0];
        var val2 = vals[1];              
        box[i].toggleProtect();
        this.square[x][y].toggleProtect();
        this.genElim(box, val1);
        this.genElim(box, val2);              
        box[i].toggleProtect();
        this.square[x][y].toggleProtect();     
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
      if (inBoxRowsBot(forNow))
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
      if (inBoxRowsMid(forNow))
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
      if (inBoxRowsTop(forNow))
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
      if (inBoxColLeft(forNow))
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
      
      if (inBoxColMid(forNow))
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
   
      if (inBoxColRight(forNow))
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
 var inBoxRowsBot = function (squarez){
   return !(squarez[4] || squarez [5] || squarez [6] || squarez[7] || squarez [8] || squarez [9])
}

var inBoxRowsMid = function (squarez){
   return !(squarez[1] || squarez [2] || squarez [3] || squarez[7] || squarez [8] || squarez [9])
}

var inBoxRowsTop = function (squarez){
   return !(squarez[1] || squarez [2] || squarez [3] || squarez[4] || squarez [5] || squarez [6])
}

var inBoxColLeft = function (squarez){
   return !(squarez[2] || squarez [5] || squarez [8] || squarez[3] || squarez [6] || squarez [9])  
}

var inBoxColMid = function (squarez){
   return!(squarez[1] || squarez [4] || squarez [7] || squarez[3] || squarez [6] || squarez [9])  
}

var inBoxColRight = function (squarez){
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
        
      if (twoBox1(boolNums))
      {
         
          this.protectBlock(tempArr, 13, 18);
          this.protectBlock(tempArr, 22, 27);
          this.blockRowElim(tempArr, 2, i);
          this.blockRowElim(tempArr, 3, i);
          this.protectBlock(tempArr, 13, 18);
          this.protectBlock(tempArr, 22, 27);
      };
      if (twoBox2(boolNums)){
          this.protectBlock(tempArr, 4, 9);
          this.protectBlock(tempArr, 22, 27);
          this.blockRowElim(tempArr, 1, i);
          this.blockRowElim(tempArr, 3, i);
          this.protectBlock(tempArr, 4, 9);
          this.protectBlock(tempArr, 22, 27);
      };
      if (twoBox3(boolNums)){
          this.protectBlock(tempArr, 4, 9);
          this.protectBlock(tempArr, 13, 18);
          this.blockRowElim(tempArr, 1, i);
          this.blockRowElim(tempArr, 2, i);
          this.protectBlock(tempArr, 4, 9);  
          this.protectBlock(tempArr, 13, 18);
      };
      if (twoBox4(boolNums)){
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
      if (twoBox5(boolNums)){
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
      if (twoBox6(boolNums)){
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
      if (twoBox7(boolNums)){
          this.protectBlock(tempArr, 10, 15);
          this.protectBlock(tempArr, 19, 24);
          this.blockRowElim(tempArr, 2, i);
          this.blockRowElim(tempArr, 3, i);
          this.protectBlock(tempArr, 10, 15);
          this.protectBlock(tempArr, 19, 24);
          
      };
      if (twoBox8(boolNums)){
          this.protectBlock(tempArr, 1, 6);
          this.protectBlock(tempArr, 19, 24);  
          this.blockRowElim(tempArr, 1, i);
          this.blockRowElim(tempArr, 3, i);
          this.protectBlock(tempArr, 1, 6);
          this.protectBlock(tempArr, 19, 24);  

      };
      if (twoBox9(boolNums)){
          this.protectBlock(tempArr, 1, 6);
          this.protectBlock(tempArr, 10, 15);
          this.blockRowElim(tempArr, 1, i);
          this.blockRowElim(tempArr, 2, i);
          this.protectBlock(tempArr, 1, 6);
          this.protectBlock(tempArr, 10, 15);
      };
   }
}

//find x-wings
Grid.prototype.starWarsRow= function(rownumber){
  for (var i=1; i<=9; i+=1){ // values 1 through 9
    if (countNotSolved(this.rowPoint(1, rownumber)).length===2){
      // find another row that has 2 unsolved 
      for (var j = 1; j < 9; i++) {
        if (countNotSolved(this.rowPoint(1, j))===countNotSolved(this.rowPoint(1, rownumber))&& !rownumber===j){
          var squarenums1=countNotSolved(rowPoint(1, rownumber))[0];
          var squarenums2=countNotSolved(rowPoint(1, rownumber))[1];
          this.rowPoint(1,j)[squarenums1].toggleProtect();
          this.rowPoint(1,j)[squarenums2].toggleProtect();
          this.rowPoint(1,rownumber)[squarenums1].toggleProtect();
          this.rowPoint(1,rownumber)[squarenums2].toggleProtect();
          this.columnElim(squarenums1, 1, i);
          this.columnElim(squarenums2, 1, i);
          this.rowPoint(1,j)[squarenums1].toggleProtect();
          this.rowPoint(1,j)[squarenums2].toggleProtect();
          this.rowPoint(1,rownumber)[squarenums1].toggleProtect();
          this.rowPoint(1,rownumber)[squarenums2].toggleProtect();
          
        }
      };
    }
  }

}


Grid.prototype.starWarsColumn= function(colnumber){
  for (var i=1; i<=9; i+=1){ // values 1 through 9
    if (countNotSolved(this.columnPoint(1, colnumber)).length===2){
      // find another row that has 2 unsolved 
      for (var j = 1; j < 9; i++) {
        if (countNotSolved(this.columnPoint(j, 1))===countNotSolved(this.columnPoint(colnumber, 1))&& !colnumber===j){
          var squarenums1=countNotSolved(this.rowPoint(1, colnumber))[0];
          var squarenums2=countNotSolved(this.rowPoint(1, colnumber))[1];
          this.columnPoint(j, 1)[squarenums1].toggleProtect();
          this.columnPoint(j, 1)[squarenums2].toggleProtect();
          this.columnPoint(colnumber, 1)[squarenums1].toggleProtect();
          this.columnPoint(colnumber, 1)[squarenums2].toggleProtect();
          this.rowElim(1, squarenums1, i);
          this.rowElim(1, squarenums2, i);
          this.columnPoint(j, 1)[squarenums1].toggleProtect();
          this.columnPoint(j, 1)[squarenums2].toggleProtect();
          this.columnPoint(colnumber, 1)[squarenums1].toggleProtect();
          this.columnPoint(colnumber, 1)[squarenums2].toggleProtect();
        }
      };
    }
  }

}

Grid.prototype.starWarsPass=function(){
  for (var i=1; i<=9; i+=1){
    this.starWarsColumn(i);
    this.starWarsRow(i);
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
   for (x=1; x<=9; x+=1)
   {
      for (y=1; y<=9; y+=1)
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
         this.starWarsPass();
         this.elimPass();
        
    }
       
        while (this.changes>0);   

   if(this.hasErrors()){console.log("we've got a problem here")}

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

var twoBox1 = function (passedArray){
   !( passedArray[4] || passedArray[5] || passedArray[6] || passedArray[7] || passedArray[8] || passedArray[9] ) 
}
var twoBox2 = function (passedArray){
   !( passedArray[13] || passedArray[14] || passedArray[15] || passedArray[16] || passedArray[17] || passedArray[18] ) 
}
var twoBox3 = function (passedArray){
   !( passedArray[22] || passedArray[23] || passedArray[24] || passedArray[25] || passedArray[26] || passedArray[27] ) 
}
var twoBox4 = function (passedArray){
   !( passedArray[1] || passedArray[2] || passedArray[3] || passedArray[7] || passedArray[8] || passedArray[9] ) 
}
var twoBox5 = function (passedArray){
   !( passedArray[10] || passedArray[11] || passedArray[12] || passedArray[16] || passedArray[17] || passedArray[18] ) 
}
var twoBox6 = function (passedArray){
   !( passedArray[19] || passedArray[20] || passedArray[21] || passedArray[25] || passedArray[26] || passedArray[27] ) 
}
var twoBox7 = function (passedArray){
   !( passedArray[1] || passedArray[2] || passedArray[3] || passedArray[4] || passedArray[5] || passedArray[6] ) 
}
var twoBox8 = function (passedArray){
   !( passedArray[10] || passedArray[11] || passedArray[12] || passedArray[13] || passedArray[14] || passedArray[15] ) 
}
var twoBox9 = function (passedArray){
   !( passedArray[19] || passedArray[20] || passedArray[21] || passedArray[22] || passedArray[23] || passedArray[24] ) 
}



// callback functions use point, elim, as a callback function
//try using filter and map?
// 

  // function ElimnCallback (PointingFN, value){
	// [PointingFN].forEach(eliminate(value),)
	//.eliminate(value);
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
Grid.prototype.hasErrors= function (){
  var errors=false
  for (var i=1; i<=9; i+=1){
    for(var j = 1; j <= 9; j+=1){
      if (this.square[i][j].solved){
        var val=this.square[i][j].value;
        var row=this.rowPoint(i, j);
        var col= this.columnPoint(i,j);
        var box = this.boxPoint(i,j);
        row.shift(); col.shift(); box.shift();
        row.forEach(function(SQRE){
          if (!(SQRE === (this.square[i][j])) && SQRE.value===val){
            errors = true;
          }
        }, this)
        col.forEach(function(SQRE){
          if (!(SQRE === (this.square[i][j])) && SQRE.value===val){
            errors = true;
          }
        }, this)
        box.forEach(function(SQRE){
          if (!(SQRE === (this.square[i][j])) && SQRE.value===val){
            errors = true;
          }
        }, this)
      };
    };
  };
  return errors
}
Grid.prototype.isfinished=function(){
  for (var i=1; i<=9; i+=1){ 
    for (var j=1; j<=9; j+=1){
      if (this.square[i][j].solved===false)
        {return false};
    }
  }
  return true;
}
//Guessing Method
Grid.prototype.guessing = function(x, y, guess){
  var newGrid= cloneGrid(this);
  

  // if (!newGrid.hasErrors && newGrid.square[x][y].numbers[guess]){
    newGrid.square[x][y].solve(guess);
    //guess and check for errors
    newGrid.fullPass();

    if (newGrid.hasErrors()){
      this.square[x][y].eliminate(guess);
    }
    else if (newGrid.isfinished()){
        this.square[x][y].solve(guess);
    };

  // }
}

/* row/box/col look for doubles.
 narrow down remaining values? put them in an array. 
 loop over array length combinations of 1,2 1,3 1,4 etc?
  (2 for loops, length and length-1 long)
  for each value find all squares that can contain both
  if total squares = 2 then you can eliminate those values from other squares

*/ 

Grid.prototype.hiddenPairs = function (PointerArray){
  for (var i=1; i<=9; i+=1){
    for(var j=i+1; j<=9; j+=1){
      var whichSquares=countNotSolved(PointerArray, i);
      if (whichSquares.equals(countNotSolved(PointerArray, j)) && whichSquares.length===2){
        this.genElim(PointerArray, i);
        this.genElim(PointerArray, j);
        for (k=1; k<=9; k+=1){
          PointerArray[whichSquares[0]].numbers[k]=false
          PointerArray[whichSquares[1]].numbers[k]=false
        };
        PointerArray[whichSquares[0]].numbers[i]=true
        PointerArray[whichSquares[0]].numbers[j]=true
          

      }
    }
  }
}

Grid.prototype.hiddenTriple = function (PointerArray){
  for (var i=1; i<=9; i+=1){
    for(var j=i+1; j<=9; j+=1){
      for (var k=j+1; k<=9; k+=1){
        var whichSquares=countNotSolved(PointerArray, i);
        if (whichSquares.equals(countNotSolved(PointerArray, j)) && whichSquares.eqauls(countNotSolved(PointerArray, k)) && whichSquares.length<=3){
          this.genElim(PointerArray, i);
          this.genElim(PointerArray, j);
          this.genElim(PointerArray, k);
          for (l=1; l<=9; l+=1){
            PointerArray[whichSquares[0]].numbers[l]=false
            PointerArray[whichSquares[1]].numbers[l]=false
            PointerArray[whichSquares[2]].numbers[l]=false
          };
          PointerArray[whichSquares[0]].numbers[l]=true
          PointerArray[whichSquares[1]].numbers[l]=true
          PointerArray[whichSquares[2]].numbers[l]=true
        }
      }
    }
  }
}


Grid.prototype.hiddenPass = function(){
  for (var i=1; i<=9; i+=1){
    this.hiddenPairs(this.rowPoint(1, i));
    this.hiddenTriple(this.rowPoint(1, i));
  };
  for (var j=1; j<=9; j+=1){
    this.hiddenPairs(this.columnPoint(j, 1));
    this.hiddenTriple(this.columnPoint(j, 1));
  };
  for (var k=1; k<=3; k+=1){
    for (var l=1; l<=3; l+=1){
      this.hiddenPairs(this.boxPoint(k, l));
      this.hiddenTriple(this.boxPoint(k, l));
    }
  };
}
var cloneGrid = function(sourceGrid){
  var newGrid= new Grid();
  newGrid.changes=sourceGrid.changes;
  for (var i=1; i<=9; i+=1){
    for (var j=1; j<=9; j+=1){
      newGrid.square[i][j].value=sourceGrid.square[i][j].value;
      newGrid.square[i][j].solved=sourceGrid.square[i][j].solved;
      newGrid.square[i][j].protect=sourceGrid.square[i][j].protect;
      for (var k=1; k<=9; k+=1){
        newGrid.square[i][j].numbers[k]=sourceGrid.square[i][j].numbers[k];
      }
    }
  }
  return newGrid;
}

// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length !== array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] !== array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
}   