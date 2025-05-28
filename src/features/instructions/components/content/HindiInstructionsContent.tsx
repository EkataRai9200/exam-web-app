import { Badge } from "@/components/ui/badge";

function HindiInstructionsContent() {
  return (
    <div>
      <p className="font-semibold underline">General Instructions:</p>

      <ol className="my-4 ml-2 md:ml-6 list-decimal [&>li]:mt-2">
        <li>
          सर्वर पर घड़ी लगाई गई है तथा आपकी स्क्रीन के दाहिने कोने में शीर्ष पर
          काउंटडाउन टाइमर में आपके लिए परीक्षा समाप्त करने के लिए शेष समय
          प्रदर्शित होगा। परीक्षा समय समाप्त होने पर, आपको अपनी परीक्षा बंद या
          जमा करने की जरूरत नहीं है । यह स्वतः बंद या जमा हो जाएगी।
        </li>
        <li>
          स्क्रीन के दाहिने कोने पर प्रश्न पैलेट, नंबर दिए प्रत्येक प्रश्न के
          लिए निम्न में से कोई एक स्थिति प्रकट करती है:
          <div className="flex flex-col gap-2">
            <div className="flex flex-nowrap gap-2 items-center">
              <Badge className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-200 text-dark">
                1
              </Badge>
              <span>आप अभी तक प्रश्न पर नहीं गए हैं। </span>
            </div>
            <div className="flex flex-nowrap gap-2 items-center">
              <Badge className="w-7 h-7 rounded-lg flex items-center justify-center bg-red-600">
                1
              </Badge>
              <span>आपने प्रश्न का उत्तर नहीं दिया है। </span>
            </div>
            <div className="flex flex-nowrap gap-2 items-center">
              <Badge className="w-7 h-7 rounded-lg flex items-center justify-center bg-green-600">
                1
              </Badge>
              <span>आप प्रश्न का उत्तर दे चुके हैं।</span>
            </div>
            <div className="flex flex-nowrap gap-2 items-center">
              <Badge className="w-7 h-7 rounded-lg flex items-center justify-center bg-purple-600">
                1
              </Badge>
              <span>
                आपने प्रश्न का उत्तर नहीं दिया है पर प्रश्न को पुनर्विचार के लिए
                चिन्हित किया है।
              </span>
            </div>
            <div className="flex flex-nowrap gap-2 items-center">
              <Badge className="w-7 h-7 rounded-lg flex items-center justify-center bg-purple-600">
                1
              </Badge>
              <span>
                आप प्रश्न का उत्तर दे चुकें हैं पर प्रश्न को पुनर्विचार के लिए
                चिन्हित किया है।
              </span>
            </div>
          </div>
          <p className="mt-2">
            पुनर्विचार के लिए चिन्हित स्थिति सामान्यत अनुस्मारक के रूप में कार्य
            करती है जोकि आपने प्रश्न को दुबारा देखने के लिए सेट किया है।{" "}
            <span className="text-red-600">
              <i>
                दि किसी प्रश्न के लिए उत्तर चुना हो जोकि पुनर्विचार के लिए
                चिन्हित किया है, तब अंतिम मूल्यांकन में उस उत्तर पर ध्यान दिया
                जाएगा।
              </i>
            </span>
          </p>
        </li>
      </ol>
      <p className="font-semibold underline">
        उत्तर देने हेतु कोई प्रश्न चुनने के लिए, आप निम्न में से कोई एक कार्य कर
        सकते हैं :
      </p>
      <ol className="my-4 ml-2 md:ml-6 list-decimal [&>li]:mt-2" start={4}>
        <li>
          To select a question to answer, you can do one of the following:
          <ol className="my-4 ml-2 md:ml-6 list-[lower-alpha] [&>li]:mt-2">
            <li>
              स्क्रीन के दांयी ओर प्रश्न पट्टिका में प्रश्न पर सीधे जाने के लिए
              प्रश्न संख्या पर क्लिक करें। ध्यान दें कि इस विकल्प का प्रयोग करने
              से मौजूदा प्रश्न के लिए आपका उत्तर सुरक्षित नहीं होता है।{" "}
            </li>
            <li>
              वर्तमान प्रश्न का उत्तर सुरक्षित करने के लिए और क्रम में अगले
              प्रश्न पर जाने के लिए<b> Save and Next</b> पर क्लिक करें।{" "}
            </li>
            <li>
              वर्तमान प्रश्न का उत्तर सुरक्षित करने के लिए, पुनर्विचार के लिए
              चिन्हित करने और क्रम में अगले प्रश्न पर जाने के लिए{" "}
              <b>Mark for Review and Next</b> पर क्लिक करें।{" "}
            </li>
          </ol>
        </li>
        <li>
          आप <b>Question Paper</b> बटन पर क्लिक करके संपूर्ण प्रश्नपत्र को देख
          सकते हैं।
        </li>
      </ol>
      <p className="font-semibold underline">प्रश्नों का उत्तर देना : </p>
      <ol className="my-4 ml-2 md:ml-6 list-decimal [&>li]:mt-2" start={6}>
        <li>
          बहुविकल्प प्रकार प्रश्न के लिए
          <ol
            className="my-4 ml-2 md:ml-6 list-[lower-alpha] [&>li]:mt-2"
            type="a"
          >
            <li>
              अपना उत्तर चुनने के लिए, विकल्प बटनों में से किसी एक पर क्लिक
              करें।{" "}
            </li>
            <li>
              अपना उत्तर बदलने के लिए, अन्य वांछित विकल्प बटन पर क्लिक करें।{" "}
            </li>
            <li>
              अपना उत्तर सुरक्षित करने के लिए, आपको <b>Save &amp; Next</b> पर
              क्लिक करना जरूरी है।{" "}
            </li>
            <li>
              चयनित उत्तर को अचयनित करने के लिए, चयनित विकल्प पर दुबारा क्लिक
              करें या <b>Clear Response</b> बटन पर क्लिक करें।{" "}
            </li>
            <li>
              किसी प्रश्न को पुनर्विचार के लिए चिन्हित करने हेतु{" "}
              <b>Mark for Review &amp; Next</b> पर क्लिक करें।{" "}
              <span className="text-red-600">
                <i>
                  यदि किसी प्रश्न के लिए उत्तर चुना हो जोकि पुनर्विचार के लिए
                  चिन्हित किया है, तब अंतिम मूल्यांकन में उस उत्तर पर ध्यान दिया
                  जाएगा।{" "}
                </i>
              </span>
            </li>
          </ol>
        </li>
        <li>
          किसी प्रश्न का उत्तर बदलने के लिए, पहले प्रश्न का चयन करें, फिर नए
          उत्तर विकल्प पर क्लिक करने के बाद <b>Save &amp; Next</b> बटन पर क्लिक
          करें।{" "}
        </li>
        <li>
          उत्तर देने के बाद जो प्रश्न सुरक्षित हैं या पुनर्विचार के लिए चिन्हित
          है, सिर्फ उन पर ही मूल्यांकन के लिए ध्यान दिया जाएगा।{" "}
        </li>
      </ol>
      <p className="font-semibold underline">Navigating through sections :</p>
      <ol className="my-4 ml-2 md:ml-6 list-decimal [&>li]:mt-2" start={9}>
        <li>
          इस प्रश्नपत्र में स्क्रीन के शीर्ष बार पर खंड प्रदर्शित होते हैं। किसी
          खंड में प्रश्न, खंड नाम पर क्लिक करके देखे जा सकते हैं। आप वर्तमान में
          जिस खंड का उत्तर दे रहे हैं, वह प्रकाशमान होगा।{" "}
        </li>
        <li>
          किसी खंड के लिए अंतिम प्रश्न के <b>Save &amp; Next</b> बटन पर क्लिक
          करने के बाद, आप स्वचालित रूप से अगले खंड के प्रथम प्रश्न पर पहुंच
          जाओगे।{" "}
        </li>
        <li>
          आप उस खंड के लिए प्रश्नों की स्थिति को देखने हेतु खंड नाम के ऊपर माउस
          कर्सर मूव कर सकते हो।{" "}
        </li>
        <li>
          आप परीक्षा के दौरान किसी भी समय खंडों और प्रश्नों के बीच अपनी सुविधा
          के अनुसार फेरबदल कर सकते हो।{" "}
        </li>
      </ol>
    </div>
  );
}

export default HindiInstructionsContent;
