<!-- Technical project -->
<template>
  <div class="home-project">
    <div class="header">
      <span id="project-header">Technical Projects</span>
    </div>
    <div class="content">
      <div class="projects-container">
        <ProjectCard :projects="projectsList" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import ProjectCard from "./ProjectComponents/ProjectCard.vue";

interface ProjectItem {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  demoVideoUrl: string;
  techStack: Array<{
    name: string;
    icon: string;
  }>;
  problemResolves: string[];
}

export default {
  components: {
    ProjectCard,
  },
  name: "Project",
  data() {
    return {
      projectsList: [
        {
          id: 1,
          name: "HCMUS Event Management",
          description:
            "This is my university-level graduation project, it has received an excellent rating at 9.3/10. The project's concept revolves around organizing events and selling tickets to university students within the campus community. With a team of five members, we successfully designed and implement a microservice architecture, resulting in a highly scalable and stale system. My primary role in this project was to develop the back-end software using the NestJS framework.",
          imageUrl: "/images/hcmus-event-management.png",
          demoVideoUrl: "https://youtu.be/j01f4toU83A",
          techStack: [
            {
              name: "NestJS",
              icon: "/icon/skill/nestjs.svg",
            },
            {
              name: "PostgreSQL",
              icon: "/icon/skill/postgresql.svg",
            },
            {
              name: "Redis",
              icon: "/icon/skill/redis.svg",
            },
            {
              name: "Docker",
              icon: "/icon/skill/docker.svg",
            },
            {
              name: "Kubernetes",
              icon: "/icon/skill/kubernetes.svg",
            },
            {
              name: "NATS Streaming",
              icon: "",
            },
            {
              name: "Swagger",
              icon: "/icon/skill/swagger.svg",
            },
            {
              name: "AWS S3",
              icon: "/icon/skill/aws.svg",
            },
          ],
          problemResolves: [
            "Microservices",
            "ACID in Database",
            "Email Integration",
            "Task Scheduling",
            "OAuth 2.0",
            "Database Optimization",
            "High Concurrency",
            "Security Techniques",
          ],
        },
        {
          id: 2,
          name: "H4 - High Performance Web Server",
          description:
            "A high-performance HTTP web server which is implemented from scratch using C++. It can accept and process a large number of the incoming request, process on-demand and response to the client. This web server support integrate with database, secured communication, logging, and authentication.",
          imageUrl: "",
          demoVideoUrl: "",
          techStack: [
            {
              name: "C++",
              icon: "/icon/skill/cpp.svg",
            },
            {
              name: "Linux",
              icon: "/icon/skill/linux.svg",
            },
            {
              name: "PostgreSQL",
              icon: "/icon/skill/postgresql.svg",
            },
            {
              name: "Docker",
              icon: "/icon/skill/docker.svg",
            },
            {
              name: "CMake",
              icon: "/icon/skill/cmake.svg",
            },
          ],
          problemResolves: [
            "HTTP Parser",
            "Asynchronous I/O",
            "Authentication",
            "Logging",
            "PostgreSQL Integration",
            "Middleware Architecture",
            "Pattern-driven Approach",
          ],
        },
        {
          id: 3,
          name: "Video Streaming Platform",
          description:
            "A platform that allows the moderators to upload the movies and cartoons and allows users to watch them online. The application focuses on high load capacity when there is high concurrent traffic, along with unlimited scaling ability at the lowest possible cost.",
          imageUrl: "",
          demoVideoUrl: "",
          techStack: [
            {
              name: "Java Spring",
              icon: "/icon/skill/spring.svg",
            },
            {
              name: "Vue.js",
              icon: "/icon/skill/vuejs.svg",
            },
            {
              name: "PostgreSQL",
              icon: "/icon/skill/postgresql.svg",
            },
            {
              name: "Kubernetes",
              icon: "/icon/skill/kubernetes.svg",
            },
            {
              name: "AWS S3",
              icon: "/icon/skill/aws.svg",
            },
            {
              name: "Redis",
              icon: "/icon/skill/redis.svg",
            },
          ],
          problemResolves: [
            "Microservice",
            "Cost Optimization",
            "Database Optimization",
            "Security Application",
            "High Concurrency",
          ],
        },
      ] as ProjectItem[],
    };
  },
};
</script>

<style scoped>
@import "../styles/project.scss";
</style>
