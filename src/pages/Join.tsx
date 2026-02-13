import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle, Cpu, Calendar, Users, Award, Rocket, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { useMembers } from '@/hooks/useMembers'
import { useToast } from '@/components/ui/Toast'
import { JoinSEO } from '@/components/SEO'
import { cn } from '@/lib/utils'

const benefits = [
  { icon: Cpu, text: 'Access to Claude API credits' },
  { icon: Calendar, text: 'Weekly workshops and build sessions' },
  { icon: Users, text: 'Mentorship from experienced builders' },
  { icon: Rocket, text: 'Networking with Anthropic community' },
  { icon: Award, text: 'Project showcase opportunities' },
  { icon: GraduationCap, text: 'Certificate of participation' },
]

const yearOptions = [
  { value: '', label: 'Select year' },
  { value: '1', label: 'Year 1' },
  { value: '2', label: 'Year 2' },
  { value: '3', label: 'Year 3' },
  { value: '4', label: 'Year 4' },
  { value: '5+', label: 'Year 5+' },
  { value: 'postgrad', label: 'Postgraduate' },
]

const departmentOptions = [
  { value: '', label: 'Select department' },
  { value: 'cs', label: 'Computer Science' },
  { value: 'it', label: 'Information Technology' },
  { value: 'se', label: 'Software Engineering' },
  { value: 'ee', label: 'Electrical Engineering' },
  { value: 'ce', label: 'Computer Engineering' },
  { value: 'business', label: 'Business Administration' },
  { value: 'economics', label: 'Economics' },
  { value: 'medicine', label: 'Medicine & Health Sciences' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'arts', label: 'Arts & Social Sciences' },
  { value: 'education', label: 'Education' },
  { value: 'other', label: 'Other' },
]

interface FormData {
  fullName: string
  email: string
  studentId: string
  yearOfStudy: string
  department: string
  whyJoin: string
  aiExperience: string
}

interface FormErrors {
  fullName?: string
  email?: string
  studentId?: string
  yearOfStudy?: string
  department?: string
}

export default function Join() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    studentId: '',
    yearOfStudy: '',
    department: '',
    whyJoin: '',
    aiExperience: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const { ref: benefitsRef, isVisible: benefitsVisible } = useScrollReveal()
  const { submitApplication, isLoading } = useMembers()
  const { showToast } = useToast()

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'fullName':
        if (!value.trim()) return 'Full name is required'
        if (value.trim().length < 2) return 'Name must be at least 2 characters'
        break
      case 'email':
        if (!value.trim()) return 'Email is required'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email'
        break
      case 'studentId':
        if (!value.trim()) return 'Student ID is required'
        break
      case 'yearOfStudy':
        if (!value) return 'Please select your year of study'
        break
      case 'department':
        if (!value) return 'Please select your department'
        break
    }
    return undefined
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (touched[name]) {
      const error = validateField(name, value)
      setErrors((prev) => ({ ...prev, [name]: error }))
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    const error = validateField(name, value)
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all fields
    const newErrors: FormErrors = {}
    const requiredFields: (keyof FormErrors)[] = ['fullName', 'email', 'studentId', 'yearOfStudy', 'department']

    requiredFields.forEach((field) => {
      const error = validateField(field, formData[field])
      if (error) newErrors[field] = error
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setTouched(requiredFields.reduce((acc, field) => ({ ...acc, [field]: true }), {}))
      return
    }

    // Submit to Supabase
    const result = await submitApplication({
      email: formData.email,
      full_name: formData.fullName,
      student_id: formData.studentId,
      year_of_study: formData.yearOfStudy,
      department: formData.department,
      bio: `Why join: ${formData.whyJoin}\n\nAI Experience: ${formData.aiExperience}`,
    })

    if (result.success) {
      setSubmitted(true)
      showToast('Application submitted successfully!', 'success')
    } else {
      showToast(result.error || 'Failed to submit application', 'error')
    }
  }

  const getInputClassName = (fieldName: keyof FormErrors) => cn(
    'w-full px-4 py-3 rounded-xl border-2 bg-white transition-all',
    'focus:outline-none focus:ring-2 focus:ring-claude-terracotta/20',
    touched[fieldName] && errors[fieldName]
      ? 'border-red-400 focus:border-red-400'
      : touched[fieldName] && !errors[fieldName] && formData[fieldName]
      ? 'border-sage focus:border-sage'
      : 'border-pampas-warm focus:border-claude-terracotta'
  )

  return (
    <>
      <JoinSEO />
      {/* Page Header */}
      <section className="bg-pampas-warm py-16 md:py-20">
        <div className="container-main">
          <nav className="flex items-center gap-2 text-sm text-stone mb-6">
            <Link to="/" className="hover:text-claude-terracotta transition-colors">Home</Link>
            <span>/</span>
            <span className="text-ink">Join</span>
          </nav>
          <div className="max-w-3xl">
            <p className="text-claude-terracotta font-sans font-bold text-xs uppercase tracking-widest mb-3">
              Become a Member
            </p>
            <h1 className="font-serif font-semibold text-ink text-3xl md:text-4xl lg:text-5xl leading-tight mb-6">
              Join Claude Builder Club
            </h1>
            <p className="text-stone text-lg md:text-xl leading-relaxed">
              Start your AI journey with a community that supports you. Learn to build with Claude,
              collaborate on real projects, and shape the future of AI in Rwanda.
            </p>
          </div>
        </div>
      </section>

      {/* Two Column: Benefits + Form */}
      <section className="py-16 md:py-20 bg-surface">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left: Benefits */}
            <div ref={benefitsRef}>
              <p className="text-claude-terracotta font-sans font-bold text-xs uppercase tracking-widest mb-3">
                Member Benefits
              </p>
              <h2 className="font-serif font-semibold text-ink text-2xl md:text-3xl mb-6">
                What You'll Get
              </h2>
              <p className="text-stone leading-relaxed mb-8">
                As a CBC-UR member, you'll have access to resources, mentorship, and opportunities
                designed to help you become a confident AI builder.
              </p>

              <ul className="space-y-4">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon
                  return (
                    <li
                      key={benefit.text}
                      className={cn(
                        'flex items-center gap-4 p-4 rounded-xl bg-white border border-pampas-warm',
                        'transition-all duration-500 ease-out',
                        'opacity-0 translate-x-4',
                        benefitsVisible && 'opacity-100 translate-x-0'
                      )}
                      style={{ transitionDelay: benefitsVisible ? `${index * 100}ms` : '0ms' }}
                    >
                      <div className="w-10 h-10 rounded-lg bg-claude-terracotta flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-ink font-medium">{benefit.text}</span>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Right: Application Form */}
            <div>
              <div className="bg-white rounded-2xl border border-pampas-warm p-6 md:p-8">
                {submitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-sage/10 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-sage" />
                    </div>
                    <h3 className="font-serif text-2xl font-semibold text-ink mb-2">
                      Application Submitted!
                    </h3>
                    <p className="text-stone mb-6">
                      Thank you for applying to Claude Builder Club! We'll review your application
                      and get back to you within 48 hours with next steps.
                    </p>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setSubmitted(false)
                        setFormData({
                          fullName: '',
                          email: '',
                          studentId: '',
                          yearOfStudy: '',
                          department: '',
                          whyJoin: '',
                          aiExperience: '',
                        })
                        setTouched({})
                        setErrors({})
                      }}
                    >
                      Submit Another Application
                    </Button>
                  </div>
                ) : (
                  <>
                    <h3 className="font-serif font-semibold text-ink text-xl mb-6">
                      Application Form
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-5">
                      {/* Full Name */}
                      <div>
                        <label className="block font-sans font-semibold text-ink text-sm mb-2">
                          Full Name <span className="text-claude-terracotta">*</span>
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Enter your full name"
                          className={getInputClassName('fullName')}
                          disabled={isLoading}
                        />
                        {touched.fullName && errors.fullName && (
                          <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block font-sans font-semibold text-ink text-sm mb-2">
                          Email <span className="text-claude-terracotta">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="your.email@ur.ac.rw"
                          className={getInputClassName('email')}
                          disabled={isLoading}
                        />
                        {touched.email && errors.email && (
                          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                        )}
                      </div>

                      {/* Student ID */}
                      <div>
                        <label className="block font-sans font-semibold text-ink text-sm mb-2">
                          Student ID <span className="text-claude-terracotta">*</span>
                        </label>
                        <input
                          type="text"
                          name="studentId"
                          value={formData.studentId}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="e.g., 220XXXXX"
                          className={getInputClassName('studentId')}
                          disabled={isLoading}
                        />
                        {touched.studentId && errors.studentId && (
                          <p className="text-red-500 text-sm mt-1">{errors.studentId}</p>
                        )}
                      </div>

                      {/* Year of Study & Department */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-sans font-semibold text-ink text-sm mb-2">
                            Year of Study <span className="text-claude-terracotta">*</span>
                          </label>
                          <select
                            name="yearOfStudy"
                            value={formData.yearOfStudy}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={getInputClassName('yearOfStudy')}
                            disabled={isLoading}
                          >
                            {yearOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                          {touched.yearOfStudy && errors.yearOfStudy && (
                            <p className="text-red-500 text-sm mt-1">{errors.yearOfStudy}</p>
                          )}
                        </div>
                        <div>
                          <label className="block font-sans font-semibold text-ink text-sm mb-2">
                            Department <span className="text-claude-terracotta">*</span>
                          </label>
                          <select
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={getInputClassName('department')}
                            disabled={isLoading}
                          >
                            {departmentOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                          {touched.department && errors.department && (
                            <p className="text-red-500 text-sm mt-1">{errors.department}</p>
                          )}
                        </div>
                      </div>

                      {/* Why do you want to join? */}
                      <div>
                        <label className="block font-sans font-semibold text-ink text-sm mb-2">
                          Why do you want to join?
                        </label>
                        <textarea
                          name="whyJoin"
                          value={formData.whyJoin}
                          onChange={handleChange}
                          rows={3}
                          placeholder="Tell us what excites you about AI and what you hope to learn..."
                          className={cn(
                            'w-full px-4 py-3 rounded-xl border-2 border-pampas-warm bg-white resize-none',
                            'focus:outline-none focus:ring-2 focus:ring-claude-terracotta/20 focus:border-claude-terracotta transition-all'
                          )}
                          disabled={isLoading}
                        />
                      </div>

                      {/* AI Experience */}
                      <div>
                        <label className="block font-sans font-semibold text-ink text-sm mb-2">
                          What's your experience with AI?
                        </label>
                        <textarea
                          name="aiExperience"
                          value={formData.aiExperience}
                          onChange={handleChange}
                          rows={3}
                          placeholder="Any experience with AI tools, programming, or related technologies..."
                          className={cn(
                            'w-full px-4 py-3 rounded-xl border-2 border-pampas-warm bg-white resize-none',
                            'focus:outline-none focus:ring-2 focus:ring-claude-terracotta/20 focus:border-claude-terracotta transition-all'
                          )}
                          disabled={isLoading}
                        />
                      </div>

                      <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Submitting...' : 'Submit Application'}
                      </Button>

                      <p className="text-stone text-xs text-center">
                        By submitting, you agree to join our WhatsApp group and receive event updates.
                      </p>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
