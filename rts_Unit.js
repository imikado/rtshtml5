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
	this.cycleObject='';
	
	this.tBuildCreation=new Array();
	
	this.team=team;
	
	this.attack=0;
	
	this.action='';
	this.oAudio;
	this.tmpIdImg='';
	
	if(this.name=='Soldier'){
		this.shortname='Soldat';
		this.src='img3/unit-soldier.png';
		this.idImg='unit-soldier';
		this.life=350;
		this.attak=20;
		
		this.costOr=200;
		
	}else if(this.name=='Archer'){
		this.shortname='Archer';
		this.src='img3/WC.png';
		this.idImg='unit-archer';
		this.life=200;
		this.attak=30;	
		
		this.costOr=500;
	}else if(this.name='Worker'){
		this.shortname='Ouvrier';
		this.src='img3/unit-worker.png';
		this.idImg='unit-worker';
		this.life=100;
		this.attak=5;
		
		this.costOr=100;
		
		this.tBuildCreation.push(new Build('SoldierHouse',this.team));
		this.tBuildCreation.push(new Build('ArcherHouse',this.team));
	}
}
Unit.prototype={
	playSound:function(action,lastAction){
		if(action==lastAction){
			return;
		}
		this.stopSound();
		
		this.oAudio=new Audio();
		this.oAudio.src=oSound.getSrc(action);
		this.oAudio.play();
		
	},
	stopSound:function(){
		if(!this.oAudio){
			return;
		}
		this.oAudio.pause();
		//this.oAudio.currentTime=0;
	},
	animate:function(action){

		oLayer_perso.clearRect(((this.x-currentX)*widthCase),((this.y-currentY)*heightCase),widthCase-2,widthCase-2);

		var tmpImg;
		if(action=='attack'){
			tmpImg=this.idImg+'_attack';
			this.playSound('attack',this.action);
		}else if(action=='walking'){
			
			var sDirection='';
			if(this.targetY < this.y){
				sDirection='Up';
			}else if(this.targetY > this.y){
				sDirection='Down';
			}else if(this.targetX > this.x){
				sDirection='Right';
			}else{
				sDirection='Left';
			}
			
			if(this.tmpIdImg==this.idImg+'_walking2'){
				tmpImg=this.idImg+'_walking'+sDirection;
			}else{
				tmpImg=this.idImg+'_walking2'+sDirection;
			}
			
			this.stopSound();
			this.tmpIdImg=tmpImg;
		}else if(action=='dead'){
			this.playSound('dead',this.action);
			return;
		}else if(action=='wood'){
			tmpImg=this.idImg;
			this.playSound('wood',this.action);
		}else if(action=='mining'){
			tmpImg=this.idImg;
			this.playSound('mining',this.action);
		}else if(action=='stand'){
			tmpImg=this.idImg;
		}
		
		oImages.drawImageOnLayer(tmpImg,((this.x-currentX)*widthCase),((this.y-currentY)*heightCase),widthCase-2,widthCase-2,'perso');
		
		this.action=action;
	},
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
			
			//on décrément la ressource or et bois
			oGame.useRessource(this.team,'or',aBuild.costOr);
			oGame.useRessource(this.team,'wood',aBuild.costWood);
			
			//on réactualise les ressources
			oGame.buildRessource();
			//on reset la sélection
			oGame.clearSelect();
			
		}
		//on enregistre les nouvelles coordonnées de l'unité
		oGame.saveUnit(this);
		
		/*if(this.team!=oGame.team){
			if(!oGame.tObscurity[this.y] || !oGame.tObscurity[this.y][this.x]){
				this.mask();
			}
		}*/
		
		
	},
	mask:function(){
		oLayer_perso.clearRect((this.x-currentX)*widthCase,(this.y-currentY)*heightCase,widthCase,heightCase);
	},
	setCycle:function(toX,toY,fromX,fromY,sObject){
		this.cycleToX=toX;
		this.cycleToY=toY;
		
		this.cycleFromX=fromX;
		this.cycleFromY=fromY;
		
		this.cycleObject=sObject;
	},
	clearCycle:function(toX,toY,fromX,fromY){
		this.cycleToX='';
		this.cycleToY='';
		
		this.cycleFromX='';
		this.cycleFromY='';
		
		this.cycleObject='';
	},
	clear:function(){
		oGame.clearUnit(this);
		oLayer_perso.clearRect((this.x-currentX)*widthCase,(this.y-currentY)*heightCase,widthCase,heightCase);
		
	},
	clearObscurity:function(){
		oLayer_brouillard2.clearRect(
							(this.x-currentX-2)*widthCase,
							(this.y-currentY-2)*widthCase,widthCase*5,widthCase*5);
		//console.log('clearObscu');
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
		
		sHtml+='<table><tr>';
			sHtml+='<td style="color:white"><img src="'+this.src+'"></br/>';
			sHtml+='<strong>Vie:</strong> '+this.life+'';
			sHtml+='</td>';
		
			if(this.name='Worker'){
				sHtml+='<td style="color:white">';
					sHtml+='<h1>Ressources transpor&eacute;es</h1>';
					sHtml+='<span style="border:1px solid gray;background:yellow">&nbsp;&nbsp;&nbsp;&nbsp;</span> ';
					sHtml+=this.or;
					
					sHtml+='<span style="padding-left:30px">&nbsp;</span>';
					
					sHtml+='<span style="border:1px solid gray;background:brown">&nbsp;&nbsp;&nbsp;&nbsp;</span> ';
					sHtml+=this.wood;
				sHtml+='</td>';
			}
		sHtml+='</tr></table>';			
		
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
		
		
		
	}
};
