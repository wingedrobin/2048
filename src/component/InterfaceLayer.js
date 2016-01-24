/**
 *
 * @file
 * @author	Yong-Quan Chen
 * @copyright
 * @license
 */

"use strict" ;

var comp = gxd.comp || { } ;

gxd.comp.InterfaceLayer = cc.Layer.extend(
{
	_timerLabel		: null ,
	_scoreLabel		: null ,
	_recordLabel	: null ,
	_pauseButton	: null ,
	_leaveButton	: null ,
	_menu			: null ,
	
	ctor : function( )
	{
		this._super( ) ;
		
		this._pauseButton = new cc.MenuItemSprite( new cc.Sprite( g_resources[ 0 ] ) ,
												   new cc.Sprite( g_resources[ 1 ] ) ,
												   new cc.Sprite( g_resources[ 2 ] ) ,
												   this._onPauseButtonClicked.bind( this ) ) ;
		
		this._leaveButton = new cc.MenuItemSprite( new cc.Sprite( g_resources[ 3 ] ) ,
												   new cc.Sprite( g_resources[ 4 ] ) ,
												   new cc.Sprite( g_resources[ 5 ] ) ,
												   this._onLeaveButtonClicked.bind( this ) ) ;
		
		this._menu = new cc.Menu( this._pauseButton , this._leaveButton ) ;
		this._menu.setPosition( cc.director.getWinSize( ).width * 0.9 ,
								cc.director.getWinSize( ).height * 0.5 ) ;
		
		this._menu.alignItemsVerticallyWithPadding( 50 ) ;
		this.addChild( this._menu ) ;
		
		
	} ,
	
	free : function( )
	{
	} ,
	
	_getRecord : function( )
	{
	} ,
	
	setScore : function( score )
	{
		this._scoreLabel.setString( score ) ;
	} ,
	
	startTimer : function( )
	{
		
	} ,
	
	pauseTimer : function( )
	{
	} ,
	
	stopTimer : function( )
	{
	} ,
	
	onEnter : function( )
	{
		this._super( ) ;
	} ,
	
	onEnterTransitionDidFinish : function( )
	{
		this._super( ) ;
	} ,
	
	_onPauseButtonClicked : function( )
	{
		cc.log( "Pause" ) ;
		this.pauseTimer( ) ;
		// this.
	} ,
	
	_onLeaveButtonClicked : function( )
	{
		cc.log( "Leave" ) ;
	} ,
	
	update : function( )
	{
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