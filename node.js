const generateForm = document.querySelector(".searchtab");
const allimage = document.querySelector(".allimage");

const OPENAI_API_KEY = "";
const updateimgcard = (imgDataArray) => {
    imgDataArray.forEach((imgobject,index) => {
        const imgcard = allimage.querySelectorAll(".imgcard")[index];
        const imgElement = imgcard.querySelector("img");
        const aiGeneratedImg=`data:image/jpeg;base64,${imgobject.b64_json}`;
        imgElement.src = aiGeneratedImg;

        imgElement.onload = () => {
            imgcard.classList.remove("loading");
        }
    });
}

const  generateAiImages = async (userprompt,usernoofimg) => {
    try{
      const response = await fetch("https://api.openai.com/v1/images/generations",{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            "prompt": userprompt,
            n: parseInt(usernoofimg),
            size: "512x512",
            response_format:"b64_json"
         })
      });

       if(!response.ok) throw new Error(" something went wrong!Try again later");

      const{ data } = await response.json();
      updateimgcard([ ...data]);
    } catch (error) {
        alert(error.message);
    }
}



const handleformsubmission = (e) => {
    e.preventDefault();
     
    const userprompt = e.srcElement[0].value;
    const usernoofimg = e.srcElement[1].value;

    

    const imgcardMarkup = Array.from({length:usernoofimg}, () =>
      `<div class="imgcard loading">
            <img src="loader.svg" alt="image">
              <a href="#" class="downloadbutton1">
               <img src="download.svg" alt="downloadicon">
               </a>
         </div>`
    ).join("");

    allimage.innerHTML = imgcardMarkup;
    generateAiImages(userprompt,usernoofimg);
}


generateForm.addEventListener("submit",handleformsubmission);
