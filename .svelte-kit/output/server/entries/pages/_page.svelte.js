import { E as escape_html, J as attr, C as pop, A as push } from "../../chunks/index.js";
/* empty css                    */
import "../../chunks/supabaseClient.js";
import { E as Eye } from "../../chunks/eye.js";
function _page($$payload, $$props) {
  push();
  let email = "";
  let password = "";
  let isLoading = false;
  $$payload.out += `<div class="min-h-screen grid lg:grid-cols-2 transition-colors duration-300 dark:bg-gray-900"><div class="relative hidden lg:block bg-cover bg-center" style="background-image: linear-gradient(180deg, rgba(103, 21, 21, 0.8) 0%, rgba(103, 21, 21, 0.3) 50%), url('/images/login_bg.png');"><div class="absolute top-8 left-8 z-20"><h1 class="text-4xl font-black text-white tracking-tight">Eucorp</h1> <p class="text-sm text-gray-200 mt-1">Institutional Planning System</p></div> <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-10"><div class="max-w-md mx-auto space-y-8"><h2 class="text-2xl font-bold text-white">Transform Your Project Management</h2> <div class="space-y-4"><div class="flex items-center space-x-4 text-white/90 hover:text-white transition-colors group"><div class="p-2 bg-rose-600/20 rounded-lg group-hover:bg-rose-600/30 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></div> <div><h3 class="font-semibold">Streamline Project Management</h3> <p class="text-sm text-white/70">Efficiently manage projects and resources in one place</p></div></div> <div class="flex items-center space-x-4 text-white/90 hover:text-white transition-colors group"><div class="p-2 bg-blue-600/20 rounded-lg group-hover:bg-blue-600/30 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></div> <div><h3 class="font-semibold">Enhanced Collaboration</h3> <p class="text-sm text-white/70">Work together seamlessly with your team members</p></div></div> <div class="flex items-center space-x-4 text-white/90 hover:text-white transition-colors group"><div class="p-2 bg-green-600/20 rounded-lg group-hover:bg-green-600/30 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></div> <div><h3 class="font-semibold">Progress Monitoring</h3> <p class="text-sm text-white/70">Track and analyze project progress in real-time</p></div></div></div></div></div></div> <div class="flex items-center justify-center px-8"><div class="w-full max-w-md"><div class="text-center mb-8"><h1 class="text-2xl font-semibold dark:text-white">${escape_html("Login")}</h1> <p class="text-gray-600 dark:text-gray-400">${escape_html("Sign in to continue")}</p></div> <form class="space-y-4">`;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <input type="email"${attr("value", email)} placeholder="name@example.com" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 dark:bg-gray-800 dark:text-white dark:border-gray-700"> <div class="relative"><input${attr("type", "password")}${attr("value", password)} placeholder="Password" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 dark:bg-gray-800 dark:text-white dark:border-gray-700"> <button type="button" class="absolute inset-y-0 right-4 flex items-center dark:text-gray-400">`;
  {
    $$payload.out += "<!--[!-->";
    Eye($$payload, { class: "w-5 h-5" });
  }
  $$payload.out += `<!--]--></button></div> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <button type="submit" class="w-full px-4 py-2 text-white bg-rose-700 rounded-lg hover:bg-rose-800 focus:ring-4 focus:ring-rose-300 dark:bg-rose-800 dark:hover:bg-rose-900"${attr("disabled", isLoading, true)}>`;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> ${escape_html("Login")}</button></form> `;
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <div class="relative my-6"><div class="absolute inset-0 flex items-center"><div class="w-full border-t border-gray-300 dark:border-gray-700"></div></div> <div class="relative flex justify-center text-sm"><span class="px-2 text-gray-500 bg-white dark:bg-gray-900 dark:text-gray-400">OR</span></div></div> <button type="button" class="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"${attr("disabled", isLoading, true)}>`;
  {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<svg class="w-5 h-5" viewBox="0 0 256 256" fill="none"><path d="M126.23 14.7L0 207.43h71.54L126.23 80.7l54.7 126.74h71.54L126.23 14.7Z" fill="#fff"></path><path d="M88.73 213.22H176l-44.76-79.55-42.51 79.55Z" fill="#fff"></path><path d="M176 213.22H252L200.28 127l-24.28 86.22Z" fill="#fff"></path></svg>`;
  }
  $$payload.out += `<!--]--> <span>${escape_html("Sign in with Azure")}</span></button> <p class="text-sm text-center mt-4 dark:text-gray-400">`;
  {
    $$payload.out += "<!--[-->";
    $$payload.out += `Don't have an account? <button class="text-blue-600 hover:underline dark:text-blue-400 font-medium">Register</button>`;
  }
  $$payload.out += `<!--]--></p></div></div></div>`;
  pop();
}
export {
  _page as default
};
