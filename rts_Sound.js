function Sound(){
    
    this.counter=0;
    this.total=0;
    this.tSrc=Array();
    this.tOAudio=Array();
    this.tPlaying=Array();
	this.tType=Array();
}
Sound.prototype={
	getSrc:function(sType){
		return this.tType[sType];
	},
    resetPlaying:function(){
	this.tPlaying=Array();
    },
    add:function(src,id){
		this.tType[id]=src;
		
	    this.tSrc[this.total]=Array();
	    this.tSrc[this.total]['src']=src;
	    this.tSrc[this.total]['id']=id;
	    
	    this.total++;
    },
    load:function(){

	    for(var i=0;i< this.total;i++){
		var id=this.tSrc[i]['id'];

		this.tOAudio[id]=new Audio();
		this.tOAudio[id].src=this.tSrc[i]['src'];
		this.tOAudio[id].onload=function(){
			
		};
		this.tOAudio[id].load();
		oSound.counter++;
			preload2();

	    }		
    },
    playSound:function(sType){
	console.log("play sound "+sType);
	this.tPlaying[sType]=1;
       //on joue le son
	this.tOAudio[sType].play();
    },
    stopSound:function(sType){
	console.log("stop sound "+sType);
	

	//on remet le son au début
	this.tOAudio[sType].pause();
	this.tOAudio[sType].currentTime=0;
	
	this.tPlaying[sType]=0;
    },
    stopPlaying:function(){
	//return;
	for(var i=0;i< this.total;i++){
	    var id=this.tSrc[i]['id'];
	    if( !this.tPlaying[ id ] && id!='building'){
		this.stopSound(id);
	    }
	    
	}
	
    }
    
};