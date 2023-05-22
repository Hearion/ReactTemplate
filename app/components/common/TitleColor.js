'use strict';
import React, {useState, useEffect } from "react";
import Color from "../../themes/Colors";
export const  TitleColor = (props)=> {
    return (
        // <label style={{color: props.color?props.color:Color.titleColor,fontSize: 25, fontWeight:700,minWidth:110}}>{props.titleName}</label>
        <label style={{color: props.color?props.color:Color.blackFsColor,fontWeight:props.fontWeight?props.fontWeight:Color.titleWeight,fontSize: 18,minWidth:props.width?props.width:'75px',marginRight:props.right?props.right:'20px'}}>{props.titleName}</label>
    );
};
