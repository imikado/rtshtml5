//Game
function Game(){
	this.tCoordUnit=Array();
	this.tCoordBuild=Array();
	this.mode='';
	this.selected='';
	this.buildcreation='';
	this.tVisible=Array();
	this.tBuild=Array();
	this.tUnit=Array();
	
	this.iOr=250;
	this.iWood=150;
}
Game.prototype={
	drawDirection:function(){
		oLayer_cadre.clear();
		//left
		oLayer_cadre.drawRect(0,0,10,oLayer_map.height,'#eeaf17','#eeaf17');
		//right
		oLayer_cadre.drawRect(oLayer_map.width-10,0,10,oLayer_map.height,'#eeaf17','#eeaf17');
		//bottom
		oLayer_cadre.drawRect(0,oLayer_map.height-10,100,10,'#eeaf17','#eeaf17');
		oLayer_cadre.drawRect(500,oLayer_map.height-10,300,10,'#eeaf17','#eeaf17');
		//top
		oLayer_cadre.drawRect(0,0,oLayer_map.width,10,'#eeaf17','#eeaf17');
	},
	goLeft:function(){
		currentX-=1;
		this.rebuild();
		oLayer_cadre.drawRect(0,0,10,oLayer_map.height,'#eeaf17','#eeaf17');
	},
	goRight:function(){
		currentX+=1;
		this.rebuild();
		oLayer_cadre.drawRect(oLayer_map.width-10,0,10,oLayer_map.height,'#eeaf17','#eeaf17');
	},
	goDown:function(){
		currentY+=1;
		this.rebuild();
		oLayer_cadre.drawRect(0,oLayer_map.height-10,100,10,'#eeaf17','#eeaf17');
		oLayer_cadre.drawRect(500,oLayer_map.height-10,300,10,'#eeaf17','#eeaf17');
	},
	goUp:function(){
		currentY-=1;
		this.rebuild();
		oLayer_cadre.drawRect(0,0,oLayer_map.width,10,'#eeaf17','#eeaf17');
	},
	rebuild:function(){
		map.rebuild();
		map.buildApercuCadre();
		
		oLayer_building.clear();
		for(var i=0;i< this.tBuild.length;i++){
			this.tBuild[i].build();
		}
		oLayer_perso.clear();
		for(var i=0;i< this.tUnit.length;i++){
			this.tUnit[i].build();
		}
		this.displayVisibility();
	},
	displayVisibility:function(){
		oLayer_brouillard.clear();
		oLayer_brouillard.drawRect(0,0,oLayer_map.width,oLayer_map.height,'#222222','#000000');
		for(var y=0;y< maxY;y++){
			for(var x=0;x<maxX;x++){
				if(this.tVisible[y+currentY] && this.tVisible[y+currentY][x+currentX] ){
					oLayer_brouillard.clearRect((x 	)*widthCase,(y)*heightCase,widthCase,heightCase);
				}
			}
		}
	},
	setVisibility:function(x,y){
		
		for(var i=-2;i<3;i++){
			if(!this.tVisible[y+i]){
				this.tVisible[y+i]=Array();
			}
			
			for(var j=-2;j<3;j++){
	
				this.tVisible[y+i][x+j]=1;
				
				map.setVisibility(x+j,y+i);
			}
		}
		
		
	},
	checkCoord:function(x,y){
		y=parseInt(y+0);
		x=parseInt(x+0);
		if(this.tCoordBuild[ y ] && this.tCoordBuild[ y ][ x ] && this.tCoordBuild[ y ][ x ]!=''){
			console.log('not libre tCoordBuild[ '+y+' ][ '+x+' ]');
			return false;
		}
		
		if(map.tMap[y] && map.tMap[y][x] && map.tMap[y][x]==3){
		
			return true;
			
		}
		return false;

	},
	checkCoordVisible:function(x,y){
		y=parseInt(y+0);
		x=parseInt(x+0);
		if(this.tVisible[ y ] && this.tVisible[ y ][ x ] && this.tVisible[ y ][ x ]==1){
			console.log('visible visible tVisible[ '+y+' ][ '+x+' ]');
			return true;
		}
		return false;
	},
	getXmouse:function(e){
		if(e && e.x!=null && e.y!=null){
			return e.x +document.body.scrollLeft;
		}else{
			return e.clientX +document.body.scrollLeft;
		}
	},
	getYmouse:function(e){
		if(e && e.x!=null && e.y!=null){
			return e.y + document.body.scrollTop;
		}else{
			return e.clientY + document.body.scrollTop;
		}
	},
	getX:function(e){
		var x=this.getXmouse(e);
		x=parseInt( x/widthCase);
	
		return x+currentX;
	},
	getY:function(e){
		var y=this.getYmouse(e);
		y=parseInt( y/widthCase);
		
		return y+currentY;
	},
	isWalkable:function(x,y){
		if(this.tCoordBuild[y] && this.tCoordBuild[y][x] && this.tCoordBuild[y][x]!=''){
			return false;
		}
		return true;
	},
	clickdroit:function(e){
		var x=this.getX(e);
		var y=this.getY(e);
		
		var aBuild=this.getBuild(x,y);
		
		//or
		if(this.selected!='' && aBuild && ( aBuild.name=='or' || aBuild.name=='wood' )){
			this.selected.cycleToX=x;
			this.selected.cycleToY=y;
			
			this.selected.cycleFromX=QGx;
			this.selected.cycleFromY=QGy;
			
			this.selected.setTarget(x,y);
		}
		
		if(!this.isWalkable(x,y)){
			return false;
		}
		
		if(this.selected!=''){
		
			this.selected.setTarget(x,y);
			//this.clearSelect();
			
				 
		}
		
		return false;
	},
	click:function(e){
		var x=this.getX(e);
		var y=this.getY(e);
		
		if(this.buildcreation!=''){
			
			var ok=1;
			if(!oGame.checkCoordVisible(x,y) || !oGame.checkCoord(x,y) ){
				ok=0;
			}else if(!oGame.checkCoordVisible(x+1,y) || !oGame.checkCoord(x+1,y) ){
				ok=0;
			}else if(!oGame.checkCoordVisible(x,y+1) || !oGame.checkCoord(x,y+1) ){
				ok=0;
			}else if(!oGame.checkCoordVisible(x+1,y+1) || !oGame.checkCoord(x+1,y+1) ){
				ok=0;
			}
			
			if(!ok){
				return;
			}
			
			 
			this.buildcreation.clear();
			this.selected.buildOn(this.buildcreation);
			
			this.buildcreation='';
			
			return;
			 
		} 
		
		var oUnit=this.getUnit(x,y);
		var oBuild=this.getBuild(x,y);
		
		
		if(oUnit){
			this.select(oUnit);
		}else if(oBuild){
			this.select(oBuild);
		}else{
			console.log('pas trouve');
			this.clearSelect();
		}
	},
	saveBuild:function(oBuild){
            
        var y=parseInt(oBuild.y);
        var x=parseInt(oBuild.x);
            
		
		if(!this.tCoordBuild[y]){
			this.tCoordBuild[y]=Array();
		}
		if(!this.tCoordBuild[y+1]){
			this.tCoordBuild[y+1]=Array();
		}
		this.tCoordBuild[y][x]=oBuild;
		this.tCoordBuild[y+1][x]=oBuild;
		this.tCoordBuild[y+1][x+1]=oBuild;
		this.tCoordBuild[y][x+1]=oBuild;
		
		//tBuild.push(oBuild);
		
	},
	getBuild:function(x,y){
		if(this.tCoordBuild[y] &&  this.tCoordBuild[y][x]){
			return this.tCoordBuild[y][x];
		}
		return null;
	},
	clearUnit:function(oUnit){
		
		var y=oUnit.y;
		var x=oUnit.x;
		
		
		this.tCoordUnit[y][x]='';
		//console.log('saveUnit '+y+' '+x);
		
		this.setVisibility(x,y);
	},
	saveUnit:function(oUnit){
		
		var y=oUnit.y;
		var x=oUnit.x;
		
		if(!this.tCoordUnit[y]){
			this.tCoordUnit[y]=Array();
		}
		this.tCoordUnit[y][x]=oUnit;
		//console.log('saveUnit '+y+' '+x);
		
		this.setVisibility(x,y);
	},
	getUnit:function(x,y){
		//console.log('search x:'+x+' '+y);
		if(this.tCoordUnit[y] &&  this.tCoordUnit[y][x]){
			return this.tCoordUnit[y][x];
		}
		return null;
	},
	chooseMove:function(){
		this.mode='move';
	},
	clearSelect:function(){
		oLayer_select.clear();
		this.selected='';
		this.resetNav();
	},
	select:function(oMix){
		this.selected=oMix;
		
		this.drawSelected();
		
		oMix.buildNav();
		
		
	},
	drawSelected:function(){
		oLayer_select.clear();
		
		oLayer_select.drawRectStroke((this.selected.x-currentX)*widthCase,(this.selected.y-currentY)*heightCase,this.selected.width,this.selected.height,'#880044',3);
	},
	resetNav:function(){
		getById('nav').innerHTML='';
	},
	refreshUnit:function(){
		
		//oLayer_perso.clear();
		
		for(var i=0;i< this.tUnit.length;i++){
			var oUnit= this.tUnit[i];
			
			if(oUnit.targetX!='' && oUnit.targetY!='' && (oUnit.targetX!=oUnit.x || oUnit.targetY!=oUnit.y) ){
			
				var vitesse=1;
				var vitesse2=vitesse*-1;
				
				oUnit.clear();
				
				
				var newX=oUnit.x;
				var newY=oUnit.y;
				
				if(oUnit.targetX!='' && oUnit.x < oUnit.targetX ){
					newX+=vitesse;
				}else if(oUnit.targetX!='' && oUnit.x > oUnit.targetX ){
					newX-=vitesse;
				}
				if(oUnit.targetY!='' && oUnit.y < oUnit.targetY ){
					newY+=vitesse;
				}else if(oUnit.targetY!='' && oUnit.y > oUnit.targetY ){
					newY-=vitesse;
				}
				
				var aBuild=this.getBuild(newX,newY);
				
				
				if(aBuild && aBuild.name=='building'){
					oUnit.x=newX;
					oUnit.y=newY;
					
					oUnit.setTarget(oUnit.cycleToX,oUnit.cycleToY);
					
					if(oUnit.or >0){
						this.addRessourceOr(oUnit.or);
					}else 	if(oUnit.wood >0){
						this.addRessourceWood(oUnit.wood);
					}

					
					oUnit.or=0;
					oUnit.wood=0;
				
				}else if(aBuild && aBuild.name=='wood' && oUnit.counter < 8){
					oUnit.counter+=1;
					
					continue;
				}else if(aBuild && aBuild.name=='wood' && oUnit.counter >= 8){
					
					oUnit.wood=10;
					
					oUnit.x=newX;
					oUnit.y=newY;
					
					oUnit.counter=0;
					
					oUnit.setTarget(oUnit.cycleFromX,oUnit.cycleFromY);
					
					
				}else if(aBuild && aBuild.name=='or' && oUnit.counter < 8){
					oUnit.counter+=1;
					
					continue;
				}else if(aBuild && aBuild.name=='or' && oUnit.counter >= 8){
					
					oUnit.or=10;
					
					oUnit.x=newX;
					oUnit.y=newY;
					
					oUnit.counter=0;
					
					oUnit.setTarget(oUnit.cycleFromX,oUnit.cycleFromY);
					
				}else if(this.checkCoord(newX,newY)){
					oUnit.x=newX;
					oUnit.y=newY;
				}else if(this.checkCoord(oUnit.x,newY)){
					//oUnit.x=newX;
					oUnit.y=newY;
				}else if(this.checkCoord(newX,oUnit.y)){
					oUnit.x=newX;
					//oUnit.y=newY;
				}else if(this.checkCoord(newX,oUnit.y)){
					oUnit.x=newX;
					//oUnit.y=newY;
				}else if(this.checkCoord(oUnit.x+vitesse2,oUnit.y)){
					//oUnit.x=newX;
					oUnit.x=oUnit.x+vitesse2;
				}else if(this.checkCoord(oUnit.x,oUnit.y+vitesse2)){
					//oUnit.x=newX;
					oUnit.y=oUnit.y+vitesse2;
				}
				
				
				oUnit.build();
				
				console.log('recalcul');
				oGame.displayVisibility();
			}
		
		}
		
		this.drawSelected();
		
	},
	createBuild:function(name,src){
		var oBuildcreation = new Buildcreation(name,src);
		oBuildcreation.build();
		
		this.buildcreation=oBuildcreation;
		 
	},
	mousemove:function(e){
		sDirection='';
		if(this.buildcreation){
		
			var x=this.getX(e);
			var y=this.getY(e);
			
			this.buildcreation.clear();
			this.buildcreation.x=x;
			this.buildcreation.y=y;
			this.buildcreation.build();
		}else if(this.getYmouse(e) < 5){
			sDirection='up';
		}else if(this.getYmouse(e) > (oLayer_map.height-10) && this.getYmouse(e) < oLayer_map.height-1 && (this.getXmouse(e) < 100 || this.getXmouse(e) > 500)){
			sDirection='down';
		}else if(this.getXmouse(e) < 5){
			sDirection='left';
		}else if(this.getXmouse(e) > (oLayer_map.width-10)){
			sDirection='right';
		}
		
	},
	addRessourceOr:function(nb){
		this.iOr+=nb;
		this.buildRessource();
	},
	addRessourceWood:function(nb){
		this.iWood+=nb;
		this.buildRessource();
	},
	
	
	buildRessource:function(){
		var a=getById('menu');
		if(a){
			var sHtml='';
			sHtml+='<span style="background:yellow;padding:0px 4px">&nbsp;</span>';
			sHtml+=' Or: '+this.iOr;
			sHtml+=' <span style="padding:0px 10px">&nbsp;</span>';
			sHtml+='<span style="background:brown;padding:0px 4px">&nbsp;</span>';
			sHtml+=' Bois: '+this.iWood;
			a.innerHTML=sHtml;
		}
	},
};
