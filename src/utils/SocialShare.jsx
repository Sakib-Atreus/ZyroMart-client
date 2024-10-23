import { useState } from "react";
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";

import {
  FacebookIcon,
  EmailIcon,
  LinkedinIcon,
  TelegramIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";

const SocialShare = () => {
  const [url, setUrl] = useState("");

  const handleInputChange = (event) => {
    setUrl(event.target.value);
  };

  const handleCopyClick = () => {
    // Create a temporary input element to copy the URL
    const tempInput = document.createElement("input");
    tempInput.value = url;
    document.body.appendChild(tempInput);

    // Select the URL text and copy it to the clipboard
    tempInput.select();
    document.execCommand("copy");

    // Remove the temporary input element
    document.body.removeChild(tempInput);

    alert("URL copied to clipboard: " + url);
  };

  const URL = "http://localhost:5173/phones";
  return (
    <div className="">
      <div className="flex gap-2">
        <FacebookShareButton
          url={URL}
          quota={"hey lets share"}
          hashtag="#Blogs"
        >
          <FacebookIcon className="w-12" logoFillColor="white" round={true}></FacebookIcon>
        </FacebookShareButton>
        <WhatsappShareButton
          url={URL}
          quota={"hey lets share"}
          hashtag="#Blogs"
        >
          <WhatsappIcon className="w-12" logoFillColor="white" round={true}></WhatsappIcon>
        </WhatsappShareButton>

        <LinkedinShareButton
          url={URL}
          quota={"hey lets share"}
          hashtag="#Blogs"
        >
          <LinkedinIcon className="w-12" logoFillColor="white" round={true}></LinkedinIcon>
        </LinkedinShareButton>

        <TwitterShareButton url={URL} quota={"hey lets share"} hashtag="#Blogs">
          <TwitterIcon className="w-12" logoFillColor="white" round={true}></TwitterIcon>
        </TwitterShareButton>

        <EmailShareButton className="w-12" url={URL} quota={"hey lets share"} hashtag="#Blogs">
          <EmailIcon className="w-12" logoFillColor="white" round={true}></EmailIcon>
        </EmailShareButton>

        <TelegramShareButton
          url={URL}
          quota={"hey lets share"}
          hashtag="#Blogs"
        >
          <TelegramIcon className="w-12" logoFillColor="white" round={true}></TelegramIcon>
        </TelegramShareButton>

      </div>
      <p className="text-sm mt-4 italic">Or copy link</p>
      <div className="lg:flex md:flex justify-start gap-1 items-center">
        <input
          className="border mt-5 p-1 bg-white rounded-lg w-4/5"
          type="text"
          placeholder="Enter URL"
          value={URL}
          onChange={handleInputChange}
        />
        <button
          className="btn-sm mt-5 bg-gradient-to-br from-orange-600 to-purple-600 font-semibold text-white rounded-lg "
          onClick={handleCopyClick}
        >
          Copy URL
        </button>
      </div>
    </div>
  );
};

export default SocialShare;
