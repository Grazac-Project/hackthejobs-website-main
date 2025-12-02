// import { authKit } from "./base";
// import axios from "axios";

// // let token = "";
// // let userId = 0;
// // try {
// //   let details = sessionStorage.getItem("user_details");
// //   token = JSON.parse(details).token;
// //   userId = JSON.parse(details).id;
// // } catch (err) {
// //   //err
// // }
// export let cancel;

// export const signupAction = (data) => {
//   return authKit.post("api/v1/user/signup", data);
// };
// export const googleLogin = (data) => {
//   return authKit.get("auth/google");
// };
// export const loginAction = (payload) => {
//   return authKit.post("api/v1/user/login", payload);
// };
// export const forgetPasswordAction = (payload) => {
//   return authKit.post("api/v1/user/forgotpassword", payload);
// };
// export const addRole = (payload, token) => {
//   return authKit.post(`api/v1/user/addrole?token=${token}`, payload);
// };
// export const resetPasswordAction = (payload, token) => {
//   return authKit.post(`api/v1/user/resetpassword?token=${token}`, payload);
// };
// export const newsLetterSub = (data) => {
//   return authKit.post("api/v1/user/news", data);
// };
// export const faqForm = (data) => {
//   return authKit.post("api/v1/user/faqform", data);
// };
// export const fetchMentors = (data, page) => {
//   return authKit.get(`api/v1/mentors/searchAll?query=${data}&page=${page}`, {
//     cancelToken: new axios.CancelToken((c) => (cancel = c)),
//   });
// };
// export const hireTalent = (data) => {
//   return authKit.post("api/v1/hire/add", data);
// };
// export const preferredMentors = (userId, mentorId) => {
//   return authKit.patch(`api/v1/user/preferred/${userId}/${mentorId}`);
// };
// export const removePreferredMentors = (mentorId) => {
//   return authKit.patch(`api/v1/user/nonPreferred/${mentorId}`);
// };

// export const PreferredMentor = (mentorId, token) => {
//   console.log("Token being sent:", token); // Ensure this logs the correct token
//   if (!token) {
//     console.error("Token is missing or invalid");
//     return;
//   }
//   return authKit.patch(
//     `/api/v1/user/preferred/${mentorId}`,
//     {},
//     {
//       headers: {
//         Authorization: `Bearer ${token}`, // Ensure the token is in the headersoken
//       },
//     }
//   );
// };

// export const bookMentorSession = (userId) => {
//   return authKit.put(`/api/v1/user/mentorSession/${userId}`);
// };
// export const getAvailableBookings = (bookingId) => {
//   return authKit.get(`api/v1/mentors/available/${bookingId}`);
// };
// export const getBookings = (mentorId) => {
//   return authKit.get(`api/v1/mentors/${mentorId}/bookings-and-packages`,

//   );
// };

// export const getSingleDigitalProduct = (Id, token) => {
//   return authKit.get(`api/v1/mentors/digital-products/${Id}`, {}, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
// };
// export const getSingleWebinar = (Id, token) => {
//   return authKit.get(`api/v1/webinars/${Id}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
// };
// export const webinarReg = (Id, data, token) => {
//   return authKit.post(`api/v1/webinars/${Id}/register`, data, {
//       // headers: {
//       //   Authorization: `Bearer ${token}`,
//       // },
//     });
// };
// export const getAllBookings = (mentorId) => {
//   return authKit.get(`api/v1/mentors/bookings/${mentorId}`);
// };
// export const BookingsSubmitAction = (data) => {
//   return authKit.post(`api/v1/book/book-session`, data);
// };
// export const MentorshipPackageSubmitAction = (data) => {
//   return authKit.post(`api/v1/book/enroll-and-book-free-package`, data);
// };
// export const getMentorsBySlug = (slug) => {
//   return authKit.get(`api/v1/mentors/slug/${slug}`);
// };

// export const fincraDigitalCheckoutData = (data, token) => {
//   return authKit.post(`api/v1/payment/checkout-data/digital-product`, data);
// };
// export const fincraPayment = (data, token) => {
//   return authKit.post(`api/v1/payment/generate-payment-link`, data, {
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//   });
// };
// export const fincraBookingCheckoutData = (data, token) => {
//   return authKit.post(`api/v1/payment/checkout-data/mentor-session`, data);
// };
// export const initializeDigitalProductPayment = (id, token) => {
//   console.log(id)
//   console.log(token)
//   return authKit.post(`api/v1/payment/digital-product/purchase`, id, {
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//   });
// };
// export const fincraWebinarCheckoutData = (data, token) => {
//   return authKit.post(`api/v1/payment/checkout-data/webinar-registration`, data, {
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//   });
// };
// authKit.interceptors.request.use((config) => {
//   // console.log("Request Config:", config);
//   return config;
// });

// export const fetchMentorsByRole = (role = "all") => {
//   return authKit.get(`/api/v1/mentors/by-role?role=${role}`);
// };
// export const allProductCheckout = (data, category) => {
//   console.log(category)
//   return authKit.post(`api/v1/payment/checkout-data/digital-product`, data);
// };
// authKit.interceptors.request.use((config) => {
//   // console.log("Request Config:", config);
//   return config;
// });

import { authKit } from "./base";
import axios from "axios";

// let token = "";
// let userId = 0;
// try {
//   let details = sessionStorage.getItem("user_details");
//   token = JSON.parse(details).token;
//   userId = JSON.parse(details).id;
// } catch (err) {
//   //err
// }
export let cancel;

export const signupAction = (data) => {
  return authKit.post("api/v1/user/signup", data);
};
export const googleLogin = (data) => {
  return authKit.get("auth/google");
};
export const loginAction = (payload) => {
  return authKit.post("api/v1/user/login", payload);
};
export const forgetPasswordAction = (payload) => {
  return authKit.post("api/v1/user/forgotpassword", payload);
};
export const addRole = (payload, token) => {
  return authKit.post(`api/v1/user/addrole?token=${token}`, payload);
};
export const resetPasswordAction = (payload, token) => {
  return authKit.post(`api/v1/user/resetpassword?token=${token}`, payload);
};
export const newsLetterSub = (data) => {
  return authKit.post("api/v1/user/news", data);
};
export const faqForm = (data) => {
  return authKit.post("api/v1/user/faqform", data);
};
export const fetchMentors = (data, page) => {
  return authKit.get(`api/v1/mentors/searchAll?query=${data}&page=${page}`, {
    cancelToken: new axios.CancelToken((c) => (cancel = c)),
  });
};
export const hireTalent = (data) => {
  return authKit.post("api/v1/hire/add", data);
};
export const preferredMentors = (userId, mentorId) => {
  return authKit.patch(`api/v1/user/preferred/${userId}/${mentorId}`);
};
export const removePreferredMentors = (mentorId) => {
  return authKit.patch(`api/v1/user/nonPreferred/${mentorId}`);
};

export const PreferredMentor = (mentorId, token) => {
  console.log("Token being sent:", token); // Ensure this logs the correct token
  if (!token) {
    console.error("Token is missing or invalid");
    return;
  }
  return authKit.patch(
    `/api/v1/user/preferred/${mentorId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`, // Ensure the token is in the headersoken
      },
    }
  );
};

export const bookMentorSession = (userId) => {
  return authKit.put(`/api/v1/user/mentorSession/${userId}`);
};
export const getAvailableBookings = (bookingId) => {
  return authKit.get(`api/v1/mentors/available/${bookingId}`);
};
export const getBookings = (mentorId) => {
  return authKit.get(`api/v1/mentors/${mentorId}/bookings-and-packages`);
};

export const getSingleDigitalProduct = (Id, token) => {
  return authKit.get(
    `api/v1/mentors/digital-products/${Id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
export const getSingleWebinar = (Id, token) => {
  return authKit.get(`api/v1/webinars/${Id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const webinarReg = (Id, data, token) => {
  return authKit.post(`api/v1/webinars/${Id}/register`, data, {
    // headers: {
    //   Authorization: `Bearer ${token}`,
    // },
  });
};
export const getAllBookings = (mentorId) => {
  return authKit.get(`api/v1/mentors/bookings/${mentorId}`);
};
export const BookingsSubmitAction = (data) => {
  // return authKit.post(`api/v1/book/book-session`, data);
  return authKit.post(`api/v1/anonymous/book-free-session`, data);
};
export const MentorshipPackageSubmitAction = (data) => {
  // return authKit.post(`api/v1/book/enroll-and-book-free-package`, data);
  return authKit.post(`api/v1/anonymous/book-free-package`, data);
};
export const MentorshipPaidPackageAction = (data) => {
  return authKit.post(`api/v1/anonymous/book-paid-package`, data);
};
export const getMentorsBySlug = (slug) => {
  return authKit.get(`api/v1/mentors/slug/${slug}`);
};

export const fincraDigitalCheckoutData = (data, token) => {
  return authKit.post(`api/v1/payment/checkout-data/digital-product`, data);
};
export const fincraPayment = (data, token) => {
  return authKit.post(`api/v1/payment/generate-payment-link`, data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};
export const fincraBookingCheckoutData = (data, token) => {
  // console.log(data)
  // return authKit.post(`api/v1/payment/checkout-data/mentor-session`, data);
  return authKit.post(`api/v1/anonymous/book-paid-session`, data);
};
export const initializeDigitalProductPayment = (id, token) => {
  return authKit.post(`api/v1/payment/digital-product/purchase`, id);
};
export const fincraWebinarCheckoutData = (data, token) => {
  return authKit.post(
    `api/v1/payment/checkout-data/webinar-registration`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
authKit.interceptors.request.use((config) => {
  // console.log("Request Config:", config);
  return config;
});

export const fetchMentorsByRole = (role = "all") => {
  return authKit.get(`/api/v1/mentors/by-role?role=${role}`);
};
export const allProductCheckout = (data, category) => {
  console.log(category);
  return authKit.post(`api/v1/payment/checkout-data/digital-product`, data);
};
export const paystackPayment = (data, token) => {
  return authKit.post(`https://api.paystack.co/transaction/initialize`, data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};
export const getProductBySlug = (mentorSlug, productSlug) => {
  return authKit.get(`api/v1/mentors/${mentorSlug}/${productSlug}`);
};

authKit.interceptors.request.use((config) => {
  // console.log("Request Config:", config);
  return config;
});
