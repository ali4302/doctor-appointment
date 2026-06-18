import { Shield, Heart, Award, Users } from 'lucide-react'

export default function About() {
  return (
    <div>
      <div className="bg-gradient-to-r from-teal-700 to-teal-600 text-white py-20 text-center">
        <h1 className="text-4xl font-bold mb-3">About MediBook</h1>
        <p className="text-teal-100 max-w-xl mx-auto">Transforming healthcare access in Pakistan through technology</p>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid md:grid-cols-2 gap-10 mb-16">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Our Mission</h2>
            <p className="text-slate-600 leading-relaxed mb-4">MediBook was founded with a simple but powerful mission: to make quality healthcare accessible to every patient in Pakistan. We bridge the gap between patients and specialists by providing a seamless, digital appointment booking experience.</p>
            <p className="text-slate-600 leading-relaxed">We believe that your time is precious. That's why we've eliminated the need for long phone queues and hospital waiting rooms for appointment scheduling.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[{icon:Heart,label:'Patient-first',desc:'Every decision is made with patient wellbeing in mind.'},{icon:Shield,label:'Trusted',desc:'Verified doctors and secure data handling.'},{icon:Award,label:'Excellence',desc:'Partnered with the top-rated medical professionals.'},{icon:Users,label:'Community',desc:'5,000+ patients served across Pakistan.'}].map(v=>(
              <div key={v.label} className="bg-teal-50 rounded-2xl p-5 border border-teal-100">
                <v.icon size={22} className="text-teal-600 mb-2"/>
                <h4 className="font-semibold text-slate-800 mb-1">{v.label}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
