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
	oGame=new Game();
	
	document.body.onkeyup=function (event){
		oGame.keyup(event);
	}
	
	setTimeout(load,1000);
}


function load(){
	//on cache la div de chargement
	getById('loading').style.display='none';
	
	//on construit la map, l'apercu 
	//et le cadre d'information de la map affichée	 
	map.build(); 
	map.buildApercu();
	map.buildApercuCadre();
	
    //on créé une unité de départ
	var oUnit =new Unit('Wordker');
	oUnit.x=4;
	oUnit.y=7;
	oUnit.build();
	
	//on ajoute cette unité à un tableau tUnit 
    //(pour pouvoir boucler dessus pour mettre à jour)
	oGame.tUnit.push(oUnit);
	
    //on créé le batiment de départ (QG)
	var oBuild=new Build('QG');
	oBuild.x=QGx;
	oBuild.y=QGy;
	oBuild.build();
	
	//on ajoute ce batiment au tableau tBuild 
	//(pour boucler et réafficher lors d'un scrolling)
	oGame.tBuild.push(oBuild);
	
	//on créé ici une mine d'or sur la map
	var oBuild=new Build('or');
	oBuild.x=17;
	oBuild.y=17;
	oBuild.build();
	
	//on ajoute cette mine d'or au tableau tBuild
	oGame.tBuild.push(oBuild);
	
	//on affiche les batiments sur la carte
	oGame.rebuild();
	//on affiche les ressouces de départ (or/bois)
	oGame.buildRessource();

	//on affiche les zones réactives
	//pour scroller la map avec la souris
	oGame.drawDirection();

	//on commencera la boucle de raffraichissement run() 
    //dans N secondes
	setTimeout(run,fps);
	
}
function run(){  

	//si la souris est sur une zone active de scroll
	if(sDirection=='up'){
		//scroll haut
		oGame.goUp();
	}else if(sDirection=='down'){
		//scroll bas
		oGame.goDown();
	}else if(sDirection=='left'){
		//scroll gauche
		oGame.goLeft();
	}else if(sDirection=='right'){
		//scroll droite
		oGame.goRight();
	}else{
		//si direction refresh, on redessine la map
		if(sDirection=='refresh'){
			oGame.rebuild();
			sDirection='';
		}
		
		//sinon on affiche les zones réactives
		oGame.drawDirection();
		
		//on raffraichit les unités
		oGame.refreshUnit();
	}
	
	
	
	//dans N secondes on appelera de nouveau cette fonction 
	setTimeout(run,fps);
}






