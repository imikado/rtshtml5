function Unit(name,team){
	this.name=name;
	this.oImage='';
	this.idImg='';
	
	this.selected=0;
	
	this.x=0;
	this.y=0;
	
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
	
	this.tBuildCreation=new Array();
	
	this.team=team;
	
	if(this.name=='Soldier'){
		this.shortname='Soldat';
		this.src='img3/WPface.png';
		this.idImg='unit-soldier';
		this.life=150;
		this.attak=20;
		
	}else if(this.name=='Archer'){
		this.shortname='Archer';
		this.src='img3/WC.png';
		this.idImg='unit-archer';
		this.life=100;
		this.attak=30;	
	}else if(this.name='Worker'){
		this.shortname='Ouvrier';
		this.src='img3/WK.png';
		this.idImg='unit-worker';
		this.life=50;
		this.attak=5;
		
		this.tBuildCreation.push(new Build('SoldierHouse',this.team));
		this.tBuildCreation.push(new Build('ArcherHouse',this.team));
	}
}
Unit.prototype={
	build:function(){
		//partie affichage de l'image de l'unité sur le canvas
		oImages.drawImageOnLayer(this.idImg,((this.x-currentX)*widthCase),((this.y-currentY)*heightCase),widthCase-2,widthCase-2,'perso');
		
		//si l'unité doit construire un batiment, et qu'elle se trouve sur les lieux de la construction
		if(this.oBuildOn && this.x+1==this.oBuildOn.x && this.y==this.oBuildOn.y){
			
			//création du batiment à l'emplacement
			var aBuild=new Build(this.oBuildOn.name,this.team);
			aBuild.x=this.oBuildOn.x;
			aBuild.y=this.oBuildOn.y;
			aBuild.level=-2;
			aBuild.sSprite='_'+aBuild.level;
			aBuild.build();
			
			//ajout du batiment à la liste des batiments (pour la reconstruction lors des scroll)
			oGame.tBuild.push(aBuild);
			//on sauvegarde les coordonnées du batiments
			oGame.saveBuild(aBuild);
			
			//on reset les propriétés de construction
			oGame.buildcreation='';
			this.buildOnX='';
			this.buildOnY='';
			this.oBuildOn='';
			
			//on décrément la ressource or
			oGame.iOr-=aBuild.costOr;
			oGame.iWood-=aBuild.costWood;
			//on réactualise les ressources
			oGame.buildRessource();
			//on reset la sélection
			oGame.clearSelect();
			
		}
		//on enregistre les nouvelles coordonnées de l'unité
		oGame.saveUnit(this);
		
	},
	setCycle:function(toX,toY,fromX,fromY){
		this.cycleToX=toX;
		this.cycleToY=toY;
		
		this.cycleFromX=fromX;
		this.cycleFromY=fromY;
	},
	clear:function(){
		oGame.clearUnit(this);
		oLayer_perso.clearRect((this.x-currentX)*widthCase,(this.y-currentY)*heightCase,widthCase,heightCase);
		
	},
	clearObscurity:function(){
		oLayer_brouillard2.clearRect(
							(this.x-currentX-2)*widthCase,
							(this.y-currentY-2)*widthCase,widthCase*5,widthCase*5);
		console.log('clearObscu');
	},
	setTarget:function(x,y){
		this.targetX=x;
		this.targetY=y;
	},
	clearTarget:function(){
		this.targetX='';
		this.targetY='';
	},
	buildNav:function(){
		var sHtml='';
		
		sHtml+='<h1>'+this.shortname+'</h1>';
		
		sHtml+='<p style="color:white"><img src="'+this.src+'"><strong>Vie:</strong> '+this.life+'</p>';			
		
		if(this.tBuildCreation.length){
			
			sHtml+='<h2>Construction</h2>';
			
			var sEnabled='';
			
			sHtml+='<table><tr>';
			
			//on boucle sur les batiments que l'unité peu construire
			for(var i=0;i<this.tBuildCreation.length;i++){
				
				var sColor='';
				var sImg='';
				if(oGame.iOr < this.tBuildCreation[i].costOr || oGame.iWood < this.tBuildCreation[i].costWood ){
					 sImg+='<input type="image" class="btnImageOff" src="'+this.tBuildCreation[i].src+'" onclick="alert(\'Pas assez de ressources!\')"/>';
					sColor='#333';
				}else{
					sImg+='<input   type="image" class="btnImage" src="'+this.tBuildCreation[i].src+'" onclick="oGame.createBuild(\''+this.tBuildCreation[i].name+'\',\''+this.tBuildCreation[i].file+'\')"/>';
					sColor='white';
				}
				
				sHtml+='<td style="background:#444;color:'+sColor+';padding:4px 8px;">';
									
					sHtml+=sImg;
				
					sHtml+='<br/>';
				
					sHtml+='<span style="border:1px solid gray;background:yellow">&nbsp;&nbsp;&nbsp;&nbsp;</span> ';
					sHtml+=this.tBuildCreation[i].costOr;
					sHtml+='<br/>';
					sHtml+='<span style="border:1px solid gray;background:brown">&nbsp;&nbsp;&nbsp;&nbsp;</span> ';
					sHtml+=this.tBuildCreation[i].costWood;
					
				sHtml+='</td>';
			}
			
			sHtml+='</tr></table>';
			
		}
		
		getById('nav').innerHTML=sHtml;
	},
	buildOn:function(oBuildOn){
		
		this.oBuildOn=oBuildOn;
		
		this.setTarget(oBuildOn.x-1,oBuildOn.y);
		
		
		
	},
};
