import { Linkedin, Mail, UserCircle } from 'lucide-react'
import { SEO } from '@/components/SEO'

const TEAM_MEMBERS = [
  {
    id: "1",
    name: "Gad Anaclet Irumva",
    role: "Ambassador",
    bio: "Passionate about building the future with AI at the University of Rwanda. Excited to help bring Claude to the UR community.",
    image: null as string | null,
    linkedin: "www.linkedin.com/in/irumvag",
    email: "irumva_223000471@stud.ur.ac.rw",
  },
  {
    id: "2",
    name: "Team Member 2",
    role: "Ambassador",
    bio: "Passionate about the intersection of technology and AI. Excited to help make Claude accessible to the UR community.",
    image: null as string | null,
    linkedin: "",
    email: "member2@ur.ac.rw",
  },
  {
    id: "3",
    name: "Team Member 3",
    role: "Ambassador",
    bio: "Loves competing in hackathons and building innovative projects. Excited to help students grow with Claude.",
    image: null as string | null,
    linkedin: "",
    email: "member3@ur.ac.rw",
  },
  {
    id: "4",
    name: "Team Member 4",
    role: "Ambassador",
    bio: "Eager to explore how AI can transform industries. Thrilled to bring new ideas and energy to the Claude Builder Club.",
    image: null as string | null,
    linkedin: "",
    email: "member4@ur.ac.rw",
  },
]

interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  image: string | null
  linkedin?: string
  email?: string
}

function TeamCard({ member }: { member: TeamMember }) {
  return (
    <div className="group rounded-xl border border-muted/20 bg-surface p-4 shadow-sm transition-all hover:border-primary/30 hover:shadow-md sm:p-6">
      {/* Profile Image */}
      <div className="mb-4 flex justify-center">
        {member.image ? (
          <img
            src={member.image}
            alt={member.name}
            className="h-24 w-24 rounded-full object-cover ring-2 ring-muted/20 transition-all group-hover:ring-primary/30 sm:h-32 sm:w-32"
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-cream ring-2 ring-muted/20 transition-all group-hover:ring-primary/30 sm:h-32 sm:w-32">
            <UserCircle className="h-16 w-16 text-primary/40 sm:h-20 sm:w-20" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="text-center">
        <h3 className="text-base font-bold text-foreground sm:text-lg">
          {member.name}
        </h3>
        <p className="mt-1 text-xs font-medium text-primary sm:text-sm">
          {member.role}
        </p>
        <p className="mt-2 text-xs text-foreground/70 sm:mt-3 sm:text-sm">
          {member.bio}
        </p>
      </div>

      {/* Social Links */}
      <div className="mt-4 flex justify-center gap-3">
        {member.linkedin && (
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-muted/10 text-foreground/50 transition-colors hover:bg-[#0077B5]/10 hover:text-[#0077B5]"
            aria-label={`${member.name}'s LinkedIn`}
          >
            <Linkedin className="h-4 w-4 sm:h-5 sm:w-5" />
          </a>
        )}
        {member.email && (
          <a
            href={`mailto:${member.email}`}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-muted/10 text-foreground/50 transition-colors hover:bg-primary/10 hover:text-primary"
            aria-label={`Email ${member.name}`}
          >
            <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
          </a>
        )}
      </div>
    </div>
  )
}

export default function Team() {
  return (
    <>
      <SEO
        title="Team"
        description="Meet the Claude Ambassadors leading the Builder Club at the University of Rwanda."
        url="/team"
      />

      {/* Page Hero */}
      <section className="border-b border-muted/20 bg-surface px-4 py-10 text-center sm:px-8 sm:py-16 md:py-20">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl lg:text-5xl">
          Meet the Team
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-foreground/70 sm:mt-6 sm:text-base md:text-lg">
          The Claude Ambassadors leading the Builder Club at the University of Rwanda
        </p>
      </section>

      {/* Team Grid */}
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-8 sm:py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM_MEMBERS.map((member) => (
            <TeamCard key={member.id} member={member} />
          ))}
        </div>
      </section>

      <section className="px-4 pb-10 sm:px-8 sm:pb-16">
        <p className="mx-auto max-w-2xl text-center text-sm leading-relaxed text-foreground/70 sm:text-base md:max-w-4xl md:text-lg">
          This club is by students, for students. If you have any questions, please don&apos;t hesitate to reach out.
        </p>
      </section>
    </>
  )
}
