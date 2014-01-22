var canvas;
var game;
var map;
var oGame;
var oImages;
var oSound;

var widthCase=30;
var heightCase=30;

var currentX=0;
var currentY=0;

var maxX=900/widthCase;
var maxY=600/heightCase;

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

var socket;


function Images(){
	this.tOImg=new Array();
	this.tDetail=new Array();
	this.counter=0;
        this.total=0;
	this.tSrc=Array();
}
Images.prototype={
	add:function(src,idImg){
	    this.tSrc[this.total]=Array();
	    this.tSrc[this.total]['src']=src;
	    this.tSrc[this.total]['idImg']=idImg;
	    
	    this.total++;
	},
	load:function(){
	    
		for(var i=0;i< this.total;i++){
		    var idImg=this.tSrc[i]['idImg'];
		    
		    this.tOImg[idImg]=new Image();
		    this.tOImg[idImg].src=this.tSrc[i]['src'];
		    this.tOImg[idImg].onload=function(){
			    oImages.counter++;
			    preload2();
		    };
		    
		}		
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
		
	}
};

function preload(){
	
	
    oSound=new Sound();
        
	oImages=new Images();
	
	var tDetailTmp=new Array();
	tDetailTmp=[
		['case-beige2','case-water','case-beige','case-wood','case-bordHautGauche','case-bordHaut','case-bordDroite','case-bordGauche','case-bordBas'],
		[
			'unit-worker',
			'unit-worker_attack',
			
			'unit-worker_walkingRight',
			'unit-worker_walking2Right',
			
			'unit-worker_walkingLeft',
			'unit-worker_walking2Left',
			
			'unit-worker_walkingDown',
			'unit-worker_walking2Down',
			
			'unit-worker_walkingUp',
			'unit-worker_walking2Up'
			
		],
		[
			'unit-soldier',
			'unit-soldier_attack',
			
			'unit-soldier_walkingRight',
			'unit-soldier_walking2Right',
			
			'unit-soldier_walkingLeft',
			'unit-soldier_walking2Left',
			
			'unit-soldier_walkingDown',
			'unit-soldier_walking2Down',
			
			'unit-soldier_walkingUp',
			'unit-soldier_walking2Up'
			
		],
		[
			'unit-archer',
			'unit-archer_attack',
			
			'unit-archer_walkingRight',
			'unit-archer_walking2Right',
			
			'unit-archer_walkingLeft',
			'unit-archer_walking2Left',
			
			'unit-archer_walkingDown',
			'unit-archer_walking2Down',
			
			'unit-archer_walkingUp',
			'unit-archer_walking2Up'
		]
		
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
		['case-houblon','case-houblon_-2','case-houblon_-1'],
		['build-brasserie','build-brasserie_-2','build-brasserie_-1']
	];
	for(var y=0;y<tDetailTmp.length;y++){
		for(var x=0;x<tDetailTmp[y].length;x++){
			oImages.setDetailOnId(tDetailTmp[y][x],y*80,x*80,80,80,'2x2');
		}
	}
	
	oImages.add('img3/sprite1x1.png','1x1');
	oImages.add('img3/sprite2x2.png','2x2');
	
	
	oSound.add('img3/attack.mp3','attack');
	oSound.add('img3/building.mp3','building');
	oSound.add('img3/dead.mp3','dead');
	oSound.add('img3/wood.mp3','wood');
	oSound.add('img3/mining.mp3','mining');
	oSound.add('img3/bierre.mp3','bierre');
	
	
	
        
	oImages.load();
	
	oSound.load();
}

function preload2(){
	
	if(oImages.counter < oImages.total){
		console.log('pas fini de charger images :'+oImages.counter+'/'+oImages.total);
		return;
	}
        
        if(oSound.counter < oSound.total){
            console.log('pas fini de charger sons :'+oSound.counter+'/'+oSound.total);
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
	oLayer_brouillard.ctx.globalAlpha=1;
	
	oLayer_brouillard2=new Canvas('layer_brouillard2');
	oLayer_brouillard2.ctx.globalAlpha=0.1;
	
	oLayer_cadre=new Canvas('layer_cadre');
	oLayer_cadre.ctx.globalAlpha=0.2;
	
	oLayer_apercuCadre=new Canvas('layer_apercuCadre');
	oLayer_apercuBuild=new Canvas('layer_apercuBuild');
	oLayer_apercuBrouillard=new Canvas('layer_apercuBrouillard');
	oLayer_apercuBrouillard.ctx.globalAlpha=1;
	
	
	oGame=new Game();
	map = new Map();
	map.build();
	
	document.body.onkeyup=function (event){
		oGame.keyup(event);
	};
	
	setTimeout(load,1000);
}


function load(){
	socket.emit('connected');
	
	//on cache la div de chargement
	getById('loading').style.display='none';
	
	//on construit la map, l'apercu 
	//et le cadre d'information de la map affichée	 
	map.build(); 
	map.buildApercu();
	map.buildApercuCadre();
	
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

	//on commencera la boucle de raffraichissement run() 
    //dans N secondes
    
   // if(oGame.team=='blue'){
	//	setTimeout(run,fps);
	//}
	
}

var iRefreshBuild=0;
function run(){  
	
	//si direction refresh, on redessine la map
	if(sDirection=='refresh'){
		oGame.rebuild();
		sDirection='';
	}
	
	//sinon on affiche les zones réactives
	//oGame.drawDirection();
	
	//on raffraichit les unités
	oGame.refreshUnit();
	
	if(iRefreshBuild> 3){
		oGame.refreshBuild();
		iRefreshBuild=0;
	}
	
	iRefreshBuild++;
	
	//console.log('run');	
	
	//dans N secondes on appelera de nouveau cette fonction 
	setTimeout(run,fps);
}
function refresh(){
	oGame.rebuild();
}






