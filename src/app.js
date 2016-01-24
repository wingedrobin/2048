

"use strict" ;

var comp	= gxd.comp || { } ;
var def		= gxd.def || { } ;
var proj	= gxd.proj || { } ;

var MainScene = cc.Scene.extend(
{
	_mainLayer		: null ,
	_interfaceLayer	: null ,
	
	ctor : function( )
	{
		this._super( ) ;
		
		cc.loader.loadJson( "res/configuration.json" , this._onConfigJsonLoadedCallback.bind( this ) ) ;
	} ,
	
	_onConfigJsonLoadedCallback : function( error , json )
	{
		if( !error )
		{
			proj.config = json ;
			
			var backgroundLayer = new cc.LayerColor( cc.color( json[ "backgroundLayerColor" ] ) ,
													 cc.director.getWinSize( ).width ,
													 cc.director.getWinSize( ).height ) ;
			backgroundLayer.setPosition( 0 , 0 ) ;
			this.addChild( backgroundLayer , 1 ) ;
			
			this._mainLayer = new comp.WindowFrameLayer( cc.color( json[ "windowFrame" ][ "windowColor" ] ) ,
															 json[ "windowFrame" ][ "frameSize" ][ "width" ] ,
															 json[ "windowFrame" ][ "frameSize" ][ "height" ] ,
															 json[ "windowFrame" ][ "rows" ] ,
															 json[ "windowFrame" ][ "columns" ] ) ;
			
			this._mainLayer.setPosition( 160 , 0 ) ;
			this.addChild( this._mainLayer , 2 ) ;
			cc.log( this._mainLayer.getContentSize( ) ) ;
			// this._interfaceLayer = new gxd.comp.InterfaceLayer( ) ;
			// this._interfaceLayer.setPosition( 0 , 0 ) ;
			// this.addChild( this._interfaceLayer , 3 ) ;
		}	
		else
			cc.log( error ) ;
	} ,
	
	onEnter : function( )
	{
		this._super( ) ;
	} ,
	
	onEnterTransitionDidFinish : function( ) 
	{
		this._super( ) ;
	} ,
	
	gameOver : function( complete )
	{
	cc.log( "in _gameOver" ) ;
		var mainLayerSize	= this._mainLayer.getContentSize( ) ;
		var message			= complete ? MainScene.completeMessage : MainScene.FailedMessage ;
	
		this._gameOverLayer = new comp.TouchBlockedLayer( cc.color( 255 , 237 , 151 , 150 ) ,
														  mainLayerSize.width ,
														  mainLayerSize.height ) ;
		
		var messageLabel	= new cc.LabelTTF( message , "Arial" , 100 ) ;
		messageLabel.setPosition( mainLayerSize.width * 0.5 ,
								  mainLayerSize.height * 0.5 ) ;
		
		this._gameOverLayer.addChild( messageLabel ) ;
		this._gameOverLayer.setPosition( this._mainLayer.getPosition( ) ) ;
		this.addChild( this._gameOverLayer , 10 ) ;
	} ,
	
	onExitTransitionDidFinish : function( )
	{
		this._super( ) ;
	} ,
	
	onExit : function( )
	{
		this._super( ) ;
	}
} ) ;

Object.defineProperty( MainScene , "completeMessage" ,
{
	value		: "You Win!" ,
	enumerable	: true
} ) ;

Object.defineProperty( MainScene , "FailedMessage" ,
{
	value		: "Game Over" ,
	enumerable	: true
} ) ;