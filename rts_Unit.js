function Unit(name,src){
	this.name=name;
	this.src='img3/'+src;
	this.oImage='';
	
	this.x=0;
	this.y=0;
	this.life=100;
	
	this.targetX='';
	this.targetY='';
	
	this.width=widthCase;
	this.height=widthCase;
	
	this.oBuildOn=null;
	
	this.counter=0;
	this.or=0;
	this.wood=0;
	
	this.cycleFromX='';
	this.cycleFromY='';
	
	this.cycleToX='';
	this.cycleToY='';
	
	this.tBuildCreation=Array();
	
	if(this.name=='soldat'){
		this.tBuildCreation[0]=new Buildcreation('buid2','build2.png');
		//this.tBuildCreation[1]=new Buildcreation('building','build1.png');
	}
}
Unit.prototype={
	build:function(){
		if(this.oImage==''){
			this.oImage=new Image(this);
			this.oImage.src=this.src;
			this.oImage._x=this.x;
			this.oImage._y=this.y;
			this.oImage.onload=this.drawImage;
		}else{
			oLayer_perso.drawImage(this.oImage ,((this.x-currentX)*widthCase),((this.y-currentY)*heightCase),widthCase-2,widthCase-2);
			
			oLayer_perso.fillRect((this.x-currentX)*widthCase,((this.y-currentY)*heightCase)+heightCase-2,widthCase,2,'#00ff00');
			
		}
		
		if(this.oBuildOn && this.x+1==this.oBuildOn.x && this.y==this.oBuildOn.y){
			
			var aBuild=new Build(this.oBuildOn.name,this.oBuildOn.src);
			aBuild.x=this.oBuildOn.x;
			aBuild.y=this.oBuildOn.y;
			aBuild.build();
			
			oGame.tBuild.push(aBuild);
			oGame.saveBuild(aBuild);
			
			oGame.buildcreation='';
			this.buildOnX='';
			this.buildOnY='';
			
			oGame.iOr-=100;
			oGame.buildRessource();
			oGame.clearSelect();
		
			this.oBuildOn='';

			
		}
		
		oGame.saveUnit(this);
	},
	clear:function(){
		oGame.clearUnit(this);
		oLayer_perso.clearRect((this.x-currentX)*widthCase,(this.y-currentY)*heightCase,widthCase,heightCase);
		
	},
	drawImage:function(){
		oLayer_perso.drawImage(this ,((this._x-currentX)*widthCase),((this._y-currentY)*heightCase),widthCase-2,widthCase-2);
		oLayer_perso.fillRect((this._x-currentX)*widthCase,((this._y-currentY)*heightCase)+heightCase-2,widthCase,2,'#00ff00');
	},
	setTarget:function(x,y){
		this.targetX=x;
		this.targetY=y;
	},
	buildNav:function(){
		var sHtml='';
		
		if(this.name=='soldat'){
			sHtml='<p><img src="'+this.src+'"></p>';
			
			sHtml+='<h2>Construction</h2>';
			
			var sEnabled='';
			
			for(var i=0;i<this.tBuildCreation.length;i++){
				if(oGame.iOr < 100){
					 sHtml+='<input type="image" class="btnImage" src="'+this.tBuildCreation[i].src+'" onclick="alert(\'Pas assez de ressources!\')"/>';
				}else{
					sHtml+='<input   type="image" class="btnImage" src="'+this.tBuildCreation[i].src+'" onclick="oGame.createBuild(\''+this.tBuildCreation[i].name+'\',\''+this.tBuildCreation[i].file+'\')"/>';
				}
				
				sHtml+=' ';
			}
			
		}else{
			sHtml='<p><img src="'+this.src+'"></p>';
			
		}
		
		getById('nav').innerHTML=sHtml;
	},
	buildOn:function(oBuildOn){
		
		this.oBuildOn=oBuildOn;
		
		this.setTarget(oBuildOn.x-1,oBuildOn.y);
		
		
		
	},
};
function UnitCreation(name,src){
	this.name=name;
	this.src=src;
}
UnitCreation.prototype={
	
};
