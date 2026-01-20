import React from "react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FORM_ERRORS } from "./_lib/formErrors";

export const useContactForm = () => {
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: "",
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    budget: "",
    timeline: "",
    project: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/landing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormStatus({
          submitted: true,
          success: true,
          message: "Message sent successfully!",
        });
        setFormData({
          name: "",
          email: "",
          budget: "",
          timeline: "",
          project: "",
        });
      } else {
        setFormStatus({
          submitted: true,
          success: false,
          message: FORM_ERRORS.CONTACT_FAILED,
        });
      }
    } catch (error) {
      setFormStatus({
        submitted: true,
        success: false,
        message: FORM_ERRORS.NETWORK_ERROR,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormStatus({
      submitted: false,
      success: false,
      message: "",
    });
  };

  return {
    formData,
    formStatus,
    isSubmitting,
    handleInputChange,
    handleSubmit,
    resetForm,
  };
};

const ContactSection = () => {
  const { formData, formStatus, isSubmitting, handleInputChange, handleSubmit, resetForm } = useContactForm();

  return (
    <section id="contact-section" className="py-20 md:py-32 bg-white text-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} whileHover={{ y: -5 }}>
            <h2 className="font-heading text-5xl md:text-6xl text-slate-900 mb-6 flex items-center justify-center gap-6">
              Work With Me
            </h2>
            <p className="text-2xl text-slate-600 max-w-3xl mx-auto">
              Let's create something amazing together. Reach out to discuss your project and how I can help.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <motion.div className="bg-slate-50 border border-slate-200 p-8 md:p-10 rounded-2xl shadow-lg" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }} whileHover={{ y: -5 }}>
            <div className="flex items-center mb-8">
              <div className="relative w-24 h-24 overflow-hidden rounded-full border-4 border-slate-200 mr-6">
                <img
                  src="/profile-photo.jpg"
                  alt="Karthik Nishanth"
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://ui-avatars.com/api/?name=Karthik+Nishanth&background=0f172a&color=fff&size=150";
                  }}
                />
              </div>
              <div>
                <h3 className="font-heading text-2xl text-slate-900">Karthik Nishanth</h3>
                <p className="text-slate-600 text-lg font-semibold">Full Stack Developer</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="font-heading text-xl text-slate-900 mb-3">My Approach</h4>
                <p className="text-slate-600 leading-relaxed">
                  I believe in creating clean, efficient, and user-focused websites that deliver real business results. My hands-on approach ensures your project gets my undivided attention from concept to launch.
                </p>
              </div>

              <div>
                <h4 className="font-heading text-xl text-slate-900 mb-3">Expertise</h4>
                <div className="flex flex-wrap gap-2">
                  {["React", "Next.js", "Node.js", "TypeScript", "Tailwind CSS", "MongoDB", "AWS", "UI/UX Design"].map((skill) => (
                    <span key={skill} className="px-3 py-1 bg-white text-slate-700 border border-slate-200 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-heading text-xl text-slate-900 mb-3">Experience</h4>
                <p className="text-slate-600 leading-relaxed">
                  With over 5 years of experience building websites and web applications for clients across industries, I understand what it takes to deliver high-quality results on time and within budget.
                </p>
              </div>

              <div className="pt-4">
                <h4 className="font-heading text-xl text-slate-900 mb-3">My Process</h4>
                <ol className="space-y-2">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center mr-3 mt-0.5 font-semibold text-xs">1</span>
                    <span className="text-slate-600">Discovery: Understanding your business and goals</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center mr-3 mt-0.5 font-semibold text-xs">2</span>
                    <span className="text-slate-600">Planning: Mapping project and setting clear milestones</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center mr-3 mt-0.5 font-semibold text-xs">3</span>
                    <span className="text-slate-600">Development: Building with best practices and regular updates</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center mr-3 mt-0.5 font-semibold text-xs">4</span>
                    <span className="text-slate-600">Deployment: Launching your project with thorough testing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center mr-3 mt-0.5 font-semibold text-xs">5</span>
                    <span className="text-slate-600">Support: Ongoing maintenance and updates as needed</span>
                  </li>
                </ol>
              </div>
            </div>

            <div className="mt-8 flex space-x-4">
              <a href="https://github.com/karthiknish" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-full text-slate-600 hover:text-slate-900 transition-colors" aria-label="GitHub Profile">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>

              <a href="https://linkedin.com/in/karthiknishanth" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-full text-slate-600 hover:text-slate-900 transition-colors" aria-label="LinkedIn Profile">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75.79 1.764s-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>

              <a href="https://twitter.com/karthiknish" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-full text-slate-600 hover:text-slate-900 transition-colors" aria-label="Twitter Profile">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
            </div>
          </motion.div>

          <motion.div className="bg-slate-50 border border-slate-200 p-8 md:p-10 rounded-2xl shadow-lg" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }} whileHover={{ y: -5 }}>
            <div className="mb-8">
              <h3 className="font-heading text-2xl text-slate-900 mb-3">Get In Touch</h3>
              <p className="text-slate-600 leading-relaxed">
                Fill out form below and I'll get back to you within 24 hours to discuss how I can help with your project.
              </p>
            </div>

            {formStatus.submitted ? (
              <motion.div className={`rounded-lg p-6 text-center ${formStatus.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h4 className={`font-heading text-xl mb-2 ${formStatus.success ? "text-green-800" : "text-red-800"}`}>
                  {formStatus.success ? "Message Sent!" : "Error"}
                </h4>
                <p className="text-slate-600">{formStatus.message}</p>

                {formStatus.success && (
                  <motion.button className="mt-4 px-6 py-2 bg-slate-900 hover:bg-slate-800 rounded-lg text-white transition-colors" onClick={resetForm} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    Send Another Message
                  </motion.button>
                )}
              </motion.div>
            ) : (
              <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-slate-700 mb-2 font-medium">Name</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200 hover:border-slate-400" placeholder="Your name" required />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-slate-700 mb-2 font-medium">Email</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-200 hover:border-slate-400" placeholder="your@email.com" required />
                  </div>
                </div>

                <div>
                  <label htmlFor="budget" className="block text-slate-700 mb-2 font-medium">Budget Range</label>
                  <select id="budget" name="budget" value={formData.budget} onChange={handleInputChange} className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent">
                    <option value="">Select budget range</option>
                    <option value="$1,000 - $5,000">$1,000 - $5,000</option>
                    <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                    <option value="$10,000 - $20,000">$10,000 - $20,000</option>
                    <option value="$20,000+">$20,000+</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="timeline" className="block text-slate-700 mb-2 font-medium">Timeline</label>
                  <select id="timeline" name="timeline" value={formData.timeline} onChange={handleInputChange} className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent">
                    <option value="">Select timeline</option>
                    <option value="Less than 1 month">Less than 1 month</option>
                    <option value="1-2 months">1-2 months</option>
                    <option value="3-6 months">3-6 months</option>
                    <option value="6+ months">6+ months</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="project" className="block text-slate-700 mb-2 font-medium">Project Details</label>
                  <textarea id="project" name="project" value={formData.project} onChange={handleInputChange} rows={5} className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent" placeholder="Tell me about your project goals, target audience, and any specific features you need..." required />
                </div>

                <div>
                  <motion.button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 rounded-2xl py-4 text-white font-bold text-lg shadow-lg transition-all duration-300 flex justify-center items-center" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        Send Message
                        <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
