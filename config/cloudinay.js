import { v2 as cloudinary } from "cloudinary";


// Cloudinary configuration
 const cloud_name =  "dcjroqlul"
const api_key = "158278732454555 "
 const api_secret = " CYyJ_dOwJ8NgJNNBYHTFnSC1Zlw"

 cloudinary.config({
    cloud_name,
    api_key,
    api_secret,
 });

 export default cloudinary;



