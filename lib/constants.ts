import locationIcon from "@/public/images/address.png";
import starIcon from "@/public/images/star.png";
import responseIcon from "@/public/images/available.png";
import popularIcon from "@/public/images/populra.png";
import experienceIcon from "@/public/images/experience.png";
import emergencyIcon from "@/public/images/Emergency.png";
import calendarIcon from "@/public/images/Calendar.png";
import discIcon from "@/public/images/disc.png";
import clockIcon from "@/public/images/tabler_clock.png";
import mediaIcon from "@/public/images/proicons_photo.png";

import cont1Img from "@/public/images/c413027525a5ebbcefdc3af396e72c44159407d6.png";
import cont4Img from "@/public/images/285e44ac1ef20aed0dfeebd8f61c0adc75be697f.png";
import cont2Img from "@/public/images/cont.jpg";
import cont3Img from "@/public/images/cont2.jpg";

export const images = {
  cont1Img,
  cont2Img,
  cont3Img,
  cont4Img,
};

export const icons = {
  locationIcon,
  starIcon,
  responseIcon,
  popularIcon,
  emergencyIcon,
  experienceIcon,
  calendarIcon,
  discIcon,
};

export const dummyImgs = [cont1Img, cont2Img, cont3Img, cont4Img, cont1Img];

export const sortBy = [
  {
    name: "Closest to you",
    icon: locationIcon,
    id: 1,
  },
  {
    name: "Ratings",
    icon: starIcon,
    id: 2,
  },
  {
    name: "Response time",
    icon: responseIcon,
    id: 3,
  },
  {
    name: "Most popular",
    icon: popularIcon,
    id: 5,
  },
];
export const sideBar = [
  {
    name: "Profile",
    icon: discIcon,
    id: 1,
  },
  {
    name: "Media",
    icon: mediaIcon,
    id: 2,
  },
  {
    name: "Availability",
    icon: clockIcon,
    id: 3,
  },
  {
    name: "Ratings",
    icon: starIcon,
    id: 5,
  },
];

export const dummyReviews = [
  {
    id: 1,
    name: "Jack Stutten",
    img: cont1Img,
    rating: 4.0,
    date: new Date(),
    review:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iste harum quaerat esse pariatur deleniti doloremque enim rem mollitia architecto, voluptates",
  },
  {
    id: 2,
    name: "Jason Statam",
    img: cont2Img,
    rating: 4.0,
    date: new Date(),
    review:
      "reiciendis ab ipsam, id ea, inventore iure amet? Deserunt, error neque. Dolore provident aspernatur ullam saepe magnam quasi, tempora quisquam facilis ipsum a esse optio",
  },
  {
    id: 3,
    name: "Robert Sanches",
    img: cont2Img,
    rating: 4.0,
    date: new Date(),
    review:
      "at reiciendis assumenda earum voluptates fuga odit illum? Maiores ipsam quia eligendi magni fugit itaque, eius ad quo repellendus odit officiis repellat, minima, corporis",
  },
  {
    id: 3,
    name: "Kelvin Stuther",
    img: cont3Img,
    rating: 4.0,
    date: new Date(),
    review:
      "nostrum quasi. A illum itaque aspernatur facere fuga! Eveniet tempora aperiam eum suscipit cupiditate, quas iure veniam ipsa eius nobis, at iste repudiandae maiores cum quasi nesciunt dolore",
  },
  {
    id: 3,
    name: "Nina Ross",
    img: cont4Img,
    rating: 4.0,
    date: new Date(),
    review:
      "magnam! Veniam accusamus aliquam cum quod tempora. Alias quas itaque tempore accusamus esse similique, iste perferendis atque ducimus aut ex consequuntur, id dignissimos minima. ",
  },
];
