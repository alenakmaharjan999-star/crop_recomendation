export default function Button({
  children,
  variant = "primary",
  to,
  href,
  type = "button",
  onClick
}) {


const styles = {
  primary:
  `
  bg-emerald-600 text-white
  hover:bg-emerald-700
  hover:shadow-xl
  `,


  secondary:
  `
  bg-white border border-slate-300
  text-slate-900
  hover:border-emerald-500
  hover:text-emerald-700
  hover:shadow-md
  `,


  danger:
  `
  bg-red-600 text-white
  hover:bg-red-700
  `

};



const common = `
inline-flex items-center justify-center
rounded-xl px-6 py-3
text-sm font-semibold

transition-all duration-300

hover:-translate-y-1

active:scale-95

${styles[variant]}
`;



if(to){

return (

<a href={to} className={common}>
{children}
</a>

)

}



if(href){

return (

<a href={href} className={common}>
{children}
</a>

)

}



return (

<button
type={type}
onClick={onClick}
className={common}
>

{children}

</button>

)

}