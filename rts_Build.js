//build
function Build(name,src){
	this.name=name;
	this.src=src;
	this.oImage='';
	
	this.x=0;
	this.y=0;
	this.life=100;
	
	this.width=widthCase*2;
	this.height=widthCase*2;
	
	this.tName=Array();
	this.tName['building']='Quartier g&eacute;n&eacute;ral';
	this.tName['or']='Mine d\'or ';
	this.tName['buid2']='Barrack';
	
	
	
	this.shortname=this.tName[name];
	
	if(this.name=='or'){
		this.color='#e8bb08';
		this.unitCreation ='';
	}else{
		this.color='#064474';
		if(this.name=='building'){
			this.unitCreation =new UnitCreation('soldat','WPface.png');
		}else{
			this.unitCreation =new UnitCreation('tank','WC.png');
		}
	}
}
Build.prototype={
	build:function(){
		if(this.oImage==''){
			this.oImage=new Image(this);
			this.oImage.src=this.src;
			this.oImage._x=this.x;
			this.oImage._y=this.y;
			this.oImage.onload=this.drawImage;
		}else{
			oLayer_building.drawImage(this.oImage ,(this.x-currentX)*widthCase,(this.y-currentY)*heightCase,widthCase*2,widthCase*2);
		}
		 
		oGame.saveBuild(this);
		
		if(this.name!='or'){
			oGame.setVisibility(this.x,this.y);
			oGame.setVisibility(this.x+1,this.y+1);
		}
	
		map.drawMiniBuild(this.x,this.y,this.color);
	},
	drawImage:function(){
		oLayer_building.drawImage(this ,(this._x-currentX)*widthCase,(this._y-currentY)*heightCase,widthCase*2,widthCase*2);
	},
	buildNav:function(){
		var sHtml='';
		
		
		sHtml+='<h1>'+this.shortname+'</h1>';
		sHtml+='<p><img src="'+this.src+'"></p>';

		
		if(this.unitCreation){
		
			sHtml+='<h2>Cr&eacute;ation unit</h2>';
			
			sHtml+='<p><input class="btnImage" type="image" src="img3/'+this.unitCreation.src+'" onclick="oGame.getBuild('+(this.x)+','+(this.y)+').createUnit()" class="btn" value="createUnit"/></p>';
		}
	
		getById('nav').innerHTML=sHtml;
	},
	createUnit:function(){
		var oUnit;
		oUnit =new Unit(this.unitCreation.name,this.unitCreation.src);
		
		oUnit.x=this.x+2;
		oUnit.y=this.y;
		oUnit.build();
		
		oGame.tUnit.push(oUnit);
		
		oGame.displayVisibility();
	}
};
//build creation
function Buildcreation(name,src){
	this.name=name;
	this.src='img3/'+src;
	this.file=src;
	this.oImage='';
	
	this.x=0;
	this.y=0;
	this.life=100;
	
	this.width=80;
	this.height=80;
}
Buildcreation.prototype={
	build:function(){
		if(this.oImage==''){
			this.oImage=new Image(this);
			this.oImage.src=this.src;
			this.oImage._x=this.x;
			this.oImage._y=this.y;
			this.oImage.onload=this.drawImage;
		}else{
			//oLayer_buildingcreation.drawImage(this.oImage ,(this.x-currentX)*widthCase,(this.y-currentY)*heightCase,widthCase*2,widthCase*2);
			oLayer_buildingcreation.fillRect((this.x-currentX)*widthCase,(this.y-currentY)*heightCase,widthCase*2,widthCase*2,'#25db12');
			
			if(!oGame.checkCoordVisible(this.x,this.y) || !oGame.checkCoord(this.x,this.y)){
				oLayer_buildingcreation.fillRect((this.x-currentX)*widthCase,(this.y-currentY)*heightCase,widthCase,widthCase,'#ff0000');
			}
			if(!oGame.checkCoordVisible(this.x+1,this.y) || !oGame.checkCoord(this.x+1,this.y) ){
				oLayer_buildingcreation.fillRect((this.x-currentX+1)*widthCase,(this.y-currentY)*heightCase,widthCase,widthCase,'#ff0000');
			}
			if(!oGame.checkCoordVisible(this.x,this.y+1) || !oGame.checkCoord(this.x,this.y+1)){
				oLayer_buildingcreation.fillRect((this.x-currentX)*widthCase,(this.y-currentY+1)*heightCase,widthCase,widthCase,'#ff0000');
			}
			if(!oGame.checkCoordVisible(this.x+1,this.y+1) || !oGame.checkCoord(this.x+1,this.y+1)){
				oLayer_buildingcreation.fillRect((this.x-currentX+1)*widthCase,(this.y-currentY+1)*heightCase,widthCase,widthCase,'#ff0000');
			}
		}
		 
		//oGame.saveBuild(this);
	},
	drawImage:function(){
		oLayer_buildingcreation.drawImage(this ,(this._x-currentX)*widthCase,(this._y-currentY)*heightCase);
	},
	clear:function(){
		oLayer_buildingcreation.clearRect((this.x-currentX)*widthCase,(this.y-currentY)*heightCase,this.width,this.height);
	},
};

//wood
function Wood(){
	this.name='wood';
	
	this.x=0;
	this.y=0;
	
	this.width=40;
	this.height=40;
}
Wood.prototype={
	build:function(){
		oGame.saveBuild(this);
	},
	clear:function(){
		
	}
}
