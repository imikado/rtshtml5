//build
function Build(name,src){
	this.name=name;
	this.oImage='';
	this.idImg='';
	this.level=0;
	this.sSprite='';
	
	this.x=0;
	this.y=0;
	this.life=100;
	
	this.width=widthCase*2;
	this.height=widthCase*2;
	
	this.color='#064474';
	this.bVisibility=1;
	
	this.costOr=0;
	this.costWood=0;
	
	if(this.name=='or'){
		this.color='#e8bb08';
		this.bVisibility=0;
		this.shortname='Mine d\'or';
		this.src='img3/mine-or.png';
		this.unitCreation ='';
		this.idImg='build-mineOr';
	}else if(this.name=='QG'){
		this.shortname='Quartier g&eacute;n&eacute;ral';
		this.src='img3/build1.png';
		this.idImg='build-QG';
		
		this.unitCreation =new Unit('Worker');
	}else if(this.name=='SoldierHouse'){
		this.shortname='Batiment des soldats';
		this.src='img3/build2.png';
		this.idImg='build-SoldierHouse';
		
		this.costOr=100;
		this.costWood=100;
		
		this.unitCreation =new Unit('Soldier');
	}else if(this.name=='ArcherHouse'){
		this.shortname='Batiment des archers';
		this.src='img3/build3.png';
		this.idImg='build-ArcherHouse';
		
		this.costOr=200;
		this.costWood=50;
		
		this.unitCreation =new Unit('Archer');
	}
	
}
Build.prototype={
	build:function(){
		
		oImages.drawImageOnLayer(this.idImg+this.sSprite,(this.x-currentX)*widthCase,(this.y-currentY)*heightCase,widthCase*2,widthCase*2,'building');
		 
		oGame.saveBuild(this);
		
		if(this.bVisibility){
			oGame.setVisibility(this.x,this.y);
			oGame.setVisibility(this.x+1,this.y+1);
		}
	
		map.drawMiniBuild(this.x,this.y,this.color);
	},
	buildNav:function(){
		var sHtml='';
		
		
		sHtml+='<h1>'+this.shortname+'</h1>';
		sHtml+='<p><img src="'+this.src+'"></p>';

		
		if(this.unitCreation){
		
			sHtml+='<h2>Cr&eacute;ation unit</h2>';
			
			sHtml+='<p><input class="btnImage" type="image" src="'+this.unitCreation.src+'" onclick="oGame.getBuild('+(this.x)+','+(this.y)+').createUnit()" class="btn" value="createUnit"/></p>';
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
//build creation (pour le choix d'un emplacement où construire un batiment)
function Buildcreation(name){
	this.name=name;
	this.oImage='';
	
	this.x=0;
	this.y=0;
	
	this.width=80;
	this.height=80;
}
Buildcreation.prototype={
	build:function(){
		 
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
		 
	},
	 
	clear:function(){
		oLayer_buildingcreation.clearRect((this.x-currentX)*widthCase,(this.y-currentY)*heightCase,this.width,this.height);
	},
};

//wood
function Wood(){
	this.name='wood';
	this.shortname='Bois';
	this.src="img3/case-wood.png";
	
	this.x=0;
	this.y=0;
	
	this.width=20;
	this.height=20;
	
	this.ressource=30;
}
Wood.prototype={
	build:function(){
		oGame.saveBuild(this);
	},
	buildNav:function(){
		var sHtml='';
		
		
		sHtml+='<h1>'+this.shortname+'</h1>';
		sHtml+='<p><img src="'+this.src+'"></p>';
		
		getById('nav').innerHTML=sHtml;
	},
	clear:function(){
		map.tMap[this.y][this.x]=3;
		oGame.clearBuild(this);
		sDirection='refresh';

		console.log('on supprime l arbre y:'+this.y+' x:'+this.x);
	}
}
