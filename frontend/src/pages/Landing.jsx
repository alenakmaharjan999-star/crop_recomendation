import PublicNavbar from "../components/PublicNavbar";

import Button from "../components/uicards/Button";
import FeatureCard from "../components/uicards/FeatureCard";
import StepCard from "../components/uicards/StepCard";
import SectionTitle from "../components/uicards/SectionTitle";

import Crop_pic from "../assets/crop_pic.png";


export default function Landing() {


const features = [
{
title:"Soil Analysis",
desc:"Analyze nitrogen, phosphorus, potassium and pH values."
},

{
title:"Location Based System",
desc:"Use location information for field analysis."
},

{
title:"Crop Prediction",
desc:"Machine learning model predicts suitable crops."
},

{
title:"Recommendation History",
desc:"Store and review previous recommendations."
}

];



const steps = [
{
step:"01",
title:"Enter Field Data",
desc:"Provide soil and location information."
},

{
step:"02",
title:"System Analysis",
desc:"Machine learning model processes parameters."
},

{
step:"03",
title:"Get Recommendation",
desc:"Receive suitable crop suggestion."
}

];



return (

<main className="scroll-smooth bg-[#fafaf7] text-slate-900">


<PublicNavbar />



{/* HERO SECTION */}


<section
className="
mx-auto grid max-w-[1150px]
items-center gap-12
px-6 py-16
md:grid-cols-2 md:px-12 md:py-24
"
>


<div>


<span
className="
inline-block rounded-full
bg-emerald-100 px-4 py-1
text-xs font-semibold
uppercase tracking-wider
text-emerald-700
"
>

Crop Recommendation System

</span>



<h1
className="
mt-5 max-w-xl
text-4xl font-bold
leading-tight md:text-5xl
"
>

Smart crop selection using machine learning

</h1>



<p
className="
mt-5 max-w-lg
leading-relaxed text-slate-600
"
>

E-Krishi helps farmers select suitable crops by analyzing soil nutrients, pH level and environmental conditions using machine learning techniques.

</p>



<div className="mt-8 flex gap-4">


<Button to="/signup">

Try Recommendation

</Button>



<Button href="#features" variant="secondary">

Explore Features

</Button>


</div>


</div>





{/* IMAGE */}


<div>


<div
className="
overflow-hidden rounded-3xl
border border-slate-200
bg-white shadow-xl

transition-all duration-300

hover:-translate-y-1
hover:shadow-2xl
"
>


<img
src={Crop_pic}
alt="Agriculture field"

className="
h-[420px]
w-full
object-cover
"
/>


</div>


</div>



</section>







{/* FEATURES */}


<section
id="features"
className="
mx-auto max-w-[1150px]
scroll-mt-20
px-6 py-20 md:px-12
"
>


<SectionTitle

eyebrow="Features"

title="Smart tools for better crop decisions"

description="
The system uses field information and machine learning techniques to recommend suitable crops.
"

/>



<div
className="
mt-10 grid gap-6 md:grid-cols-4
"
>


{
features.map((item,index)=>(

<FeatureCard

key={index}

title={item.title}

desc={item.desc}

/>

))
}


</div>


</section>








{/* RECOMMENDATION */}


<section

id="recommendation"

className="
mx-auto max-w-[1150px]
scroll-mt-20
px-6 py-16 md:px-12
"

>


<SectionTitle

eyebrow="Recommendation Preview"

title="Sample field analysis result"

/>




<div
className="
mt-8 grid overflow-hidden
rounded-3xl border border-slate-200
bg-white md:grid-cols-2
"
>


<div className="p-8">


<h3 className="font-bold">
Field Parameters
</h3>



<div
className="
mt-6 grid grid-cols-2 gap-4
"
>


{
[
["Nitrogen","72"],
["Phosphorus","38"],
["Potassium","41"],
["pH Level","6.7"],
["Location","Kathmandu"]

].map((item,index)=>(


<div
key={index}

className="
rounded-xl bg-slate-50 p-4

transition-all duration-300

hover:bg-emerald-50
"
>


<p className="text-xs text-slate-500">

{item[0]}

</p>



<p className="mt-1 font-bold">

{item[1]}

</p>


</div>


))


}


</div>


</div>






<div
className="
flex items-center justify-center
bg-emerald-50 p-8
"
>


<div className="text-center">


<p className="text-sm text-slate-600">

Recommended Crop

</p>


<h3
className="
mt-3 text-5xl font-bold
text-emerald-700
"
>

Rice

</h3>



<p className="mt-4 text-sm text-slate-600">

Generated using machine learning analysis.

</p>


</div>


</div>


</div>


</section>








{/* HOW IT WORKS */}


<section

id="how-it-works"

className="
mx-auto max-w-[1150px]
scroll-mt-20
px-6 py-20 md:px-12
"

>


<SectionTitle

eyebrow="How it works"

title="Simple steps to get recommendation"

/>




<div
className="
mt-10 grid gap-6 md:grid-cols-3
"
>


{
steps.map((item,index)=>(


<StepCard

key={index}

step={item.step}

title={item.title}

desc={item.desc}

/>


))
}


</div>


</section>








{/* FOOTER */}


<footer

className="
bg-slate-950
px-6 py-10
text-center text-white
"

>


<h3 className="text-xl font-bold">

E-Krishi

</h3>



<p
className="
mt-2 text-sm text-slate-300
"
>

Machine Learning Based Crop Recommendation System

</p>


</footer>



</main>

);

}