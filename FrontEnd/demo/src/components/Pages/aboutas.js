import React from "react";
import Header from "./header";
import { Card } from "reactstrap";

export default function About() {
  return (
    <div>
<Header/>

      <div
        style={{
          backgroundColor:"aqua",
          padding: "40px",
          paddingTop:"5%",
          borderRadius: "10px",
          maxWidth: "700px",
          margin: "0 auto",
          color: "black",
        }}
      >
      <h2 style={{textAlign: "center", padding: "20px",backgroundColor:"blue", marginBottom: "20px",color:"white", fontFamily:"Times New Roman, Times, serif;"}}>About OF FoodConnect</h2>

      <h3 style={{fontFamily:"sans-serif"}}>Thank you for using FoodConnect</h3><br/>
      <p><h2>With FoodConnect, you can order food from your nearest restaurant and enjoy it with family and friends</h2></p><br/>
       <Card style={{backgroundColor:"blue", color:"white", fontFamily:"Courier, Monaco, monospace"}}>
       <p><center>If you have any problem or question then contact as at dev@gmail.com</center></p>
       </Card><br/>
               <p>We Are charge to restaurant 25 rs per item for Service</p>
        
      </div>
      

      
    </div>
  );
}
