var canvas;
var game;
var map;
var oGame;
var oImages;

var widthCase=20;
var heightCase=20;

var currentX=0;
var currentY=0;

var maxX=40;
var maxY=20;

var QGx=10;
var QGy=10;

var oLayer_map;
var oLayer_building;
var oLayer_perso;
var oLayer_select;
var oLayer_brouillard;
var oLayer_cadre;
var oLayer_apercu;
var oLayer_apercuCadre;
var oLayer_apercuBrouillard;
var oLayer_apercuBuild;

var fps=250;

var sDirection='';


function Images(){
	
}
Images.prototype={
	load:function(src){
		
	}
};

function preload(){
	oLayer_map=new Canvas('layer_map');
	oLayer_apercu=new Canvas('layer_apercu');
	oLayer_building=new Canvas('layer_building');
	oLayer_perso=new Canvas('layer_perso');
	oLayer_select=new Canvas('layer_select');
	oLayer_buildingcreation=new Canvas('layer_newbuild');
	oLayer_buildingcreation.ctx.globalAlpha=0.9;
	
	oLayer_brouillard=new Canvas('layer_brouillard');
	oLayer_brouillard.ctx.globalAlpha=0.9;
	
	oLayer_cadre=new Canvas('layer_cadre');
	oLayer_cadre.ctx.globalAlpha=0.2;
	
	oLayer_apercuCadre=new Canvas('layer_apercuCadre');
	oLayer_apercuBuild=new Canvas('layer_apercuBuild');
	oLayer_apercuBrouillard=new Canvas('layer_apercuBrouillard');
	oLayer_apercuBrouillard.ctx.globalAlpha=0.9;
	
	map = new Map();
	oGame=new Game;
	
	setTimeout(load,1000);
}


function load(){
	getById('loading').style.display='none';
	
	//oLayer_cadre.drawRectStroke(0,0,600,400,'#eee',20);
	
	oLayer_perso.ctx.globalCompositeOperation = 'destination-over';
	 
	
	map.build(); 
	map.buildApercu();
	map.buildApercuCadre();
	
	var oUnit =new Unit('soldat','WPface.png');
	oUnit.x=4;
	oUnit.y=7;
	oUnit.build();
	
	oGame.tUnit.push(oUnit);
	
	var oBuild=new Build('building','img3/build1.png');
	oBuild.x=QGx;
	oBuild.y=QGy;
	oBuild.build();
	
	oGame.tBuild.push(oBuild);
	
	
	var oBuild=new Build('or','img3/mine-or.png');
	oBuild.x=17;
	oBuild.y=17;
	oBuild.build();
	
	oGame.tBuild.push(oBuild);
	
	 oGame.rebuild();
	 oGame.buildRessource();
//	oGame.displayVisibility();
	
	oGame.drawDirection();
	 
	setTimeout(run,fps);
	
}
function run(){  
	//oGame.rebuild();
	
	//oLayer_cadre.clear();
	
	if(sDirection=='up'){
		oGame.goUp();
	}else if(sDirection=='down'){
		oGame.goDown();
	}else if(sDirection=='left'){
		oGame.goLeft();
	}else if(sDirection=='right'){
		oGame.goRight();
	}else{
		oGame.drawDirection();
	}
	
	oGame.refreshUnit();
		
	setTimeout(run,fps);
}






