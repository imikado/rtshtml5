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
var oLayer_cursor;
var oLayer_brouillard;
var oLayer_brouillard2;
var oLayer_cadre;
var oLayer_apercu;
var oLayer_apercuCadre;
var oLayer_apercuBrouillard;
var oLayer_apercuBuild;

var fps=300;

var sDirection='';


function Images(){
	this.tOImg=new Array();
	this.tDetail=new Array();
	this.counter=0;
}
Images.prototype={
	load:function(src,idImg){
		this.tOImg[idImg]=new Image();
		this.tOImg[idImg].src=src;
		this.tOImg[idImg].onload=function(){
			oImages.counter++;
			preload2();
		}
		//this.tOImg[idImg]=oImg;
	},
	setDetailOnId:function(id,y,x,width,height,idImg){
		this.tDetail[id]=new Array();
		this.tDetail[id]['x']=x;
		this.tDetail[id]['y']=y;
		this.tDetail[id]['width']=width;
		this.tDetail[id]['height']=height;
		this.tDetail[id]['idImg']=idImg;
	},
	drawImageOnLayer:function(id,x,y,width,height,sLayer){
		var oCanvasTmp;
		if(sLayer=='map'){
			oCanvasTmp=oLayer_map;
		}else if(sLayer=='apercu'){
			oCanvasTmp=oLayer_apercu;
		}else if(sLayer=='perso'){
			oCanvasTmp=oLayer_perso;
		}else if(sLayer=='building'){
			oCanvasTmp=oLayer_building;
		}
		
		oCanvasTmp.drawImage2(this.tOImg[ this.tDetail[id]['idImg'] ],this.tDetail[id]['x'],this.tDetail[id]['y'],this.tDetail[id]['width'],this.tDetail[id]['height'],x,y,width,height);
		
	},
};

function preload(){
	
	oImages=new Images();
	
	var tDetailTmp=new Array();
	tDetailTmp=[
		['case-beige2','case-water','case-beige','case-wood'],
		['unit-worker'],
		['unit-soldier'],
		['unit-archer'],
	];
	for(var y=0;y<tDetailTmp.length;y++){
		for(var x=0;x<tDetailTmp[y].length;x++){
			oImages.setDetailOnId(tDetailTmp[y][x],y*40,x*40,40,40,'1x1');
		}
	}
	var tDetailTmp=new Array();
	tDetailTmp=[
		['build-SoldierHouse','build-SoldierHouse_-2','build-SoldierHouse_-1'],
		['build-QG','build-QG_-2','build-QG_-1'],
		['build-ArcherHouse','build-ArcherHouse_-2','build-ArcherHouse_-1'],
		
		['build-mineOr'],
	];
	for(var y=0;y<tDetailTmp.length;y++){
		for(var x=0;x<tDetailTmp[y].length;x++){
			oImages.setDetailOnId(tDetailTmp[y][x],y*80,x*80,80,80,'2x2');
		}
	}
	
	oImages.load('img3/sprite1x1.png','1x1');
	oImages.load('img3/sprite2x2.png','2x2');
	
}

function preload2(){
	
	if(oImages.counter < 2){
		console.log('pas fini de charger :'+oImages.counter);
		return;
	}
	
	
	
	oLayer_map=new Canvas('layer_map');
	oLayer_apercu=new Canvas('layer_apercu');
	oLayer_building=new Canvas('layer_building');
	oLayer_perso=new Canvas('layer_perso');
	oLayer_select=new Canvas('layer_select');
	oLayer_cursor=new Canvas('layer_cursor');
	
	
	oLayer_buildingcreation=new Canvas('layer_newbuild');
	oLayer_buildingcreation.ctx.globalAlpha=0.9;
	
	oLayer_brouillard=new Canvas('layer_brouillard');
	oLayer_brouillard.ctx.globalAlpha=0.9;
	
	oLayer_brouillard2=new Canvas('layer_brouillard2');
	oLayer_brouillard2.ctx.globalAlpha=0.5;
	
	oLayer_cadre=new Canvas('layer_cadre');
	oLayer_cadre.ctx.globalAlpha=0.2;
	
	oLayer_apercuCadre=new Canvas('layer_apercuCadre');
	oLayer_apercuBuild=new Canvas('layer_apercuBuild');
	oLayer_apercuBrouillard=new Canvas('layer_apercuBrouillard');
	oLayer_apercuBrouillard.ctx.globalAlpha=0.9;
	
	
	oGame=new Game();
	map = new Map();
	map.build();
	
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
	var oUnit =new Unit('Worker','blue');
	oUnit.x=4;
	oUnit.y=7;
	oUnit.build();
	
	//on ajoute cette unité à un tableau tUnit 
    //(pour pouvoir boucler dessus pour mettre à jour)
	oGame.tUnit.push(oUnit);
	
	//on créé une enemie qui parcourt la carte
	var oUnit2 =new Unit('Soldier','green');
	oUnit2.x=30;
	oUnit2.y=9;
	oUnit2.setCycle(10,7,40,9)
	oUnit2.setTarget(10,7);
	oUnit2.build();
	oGame.tUnit.push(oUnit2);
	
    //on créé le batiment de départ (QG)
	var oBuild=new Build('QG','blue');
	oBuild.x=QGx;
	oBuild.y=QGy;
	oBuild.build();
	
	//on ajoute ce batiment au tableau tBuild 
	//(pour boucler et réafficher lors d'un scrolling)
	oGame.tBuild.push(oBuild);
	
	//on créé ici une mine d'or sur la map
	var oBuild=new Build('or','or');
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
var iRefreshBuild=0;
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
		
		if(iRefreshBuild> 3){
			oGame.refreshBuild();
			iRefreshBuild=0;
		}
		
		iRefreshBuild++;
		
	}
	
	
	
	//dans N secondes on appelera de nouveau cette fonction 
	setTimeout(run,fps);
}






