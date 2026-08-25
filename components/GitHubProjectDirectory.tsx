"use client";

import { useMemo, useState } from "react";

import { BrowserNavigationLink } from "@/components/BrowserNavigationLink";
import { ResourceLogo } from "@/components/ResourceLogo";
import { getGitHubDifficultyClass, getGitHubProjectLogo, getGitHubProjectUrl, githubProjectCategories, githubProjects } from "@/data/githubProjects";
import { getTool } from "@/data/tools";

export function GitHubProjectDirectory() {
  const [categoryId, setCategoryId] = useState("all");
  const [query, setQuery] = useState("");

  const projects = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("zh-CN");
    return githubProjects.filter((project) => {
      const matchesCategory = categoryId === "all" || project.categoryId === categoryId;
      const searchable = `${project.name} ${project.repository} ${project.description} ${project.tags.join(" ")}`.toLocaleLowerCase("zh-CN");
      return matchesCategory && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [categoryId, query]);

  return (
    <>
      <div className="resource-controls github-controls">
        <label className="resource-search"><span aria-hidden="true">⌕</span><span className="sr-only">搜索 GitHub 项目</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索项目或用途" /></label>
        <div className="resource-filters" aria-label="GitHub 项目分类筛选">
          <button className={categoryId === "all" ? "active" : ""} type="button" onClick={() => setCategoryId("all")}>全部</button>
          {githubProjectCategories.map((category) => <button className={categoryId === category.id ? "active" : ""} type="button" key={category.id} onClick={() => setCategoryId(category.id)}>{category.title}</button>)}
        </div>
      </div>

      <p className="resource-count" aria-live="polite">当前显示 {projects.length} 个开源项目</p>
      {projects.length > 0 ? <div className="resource-site-grid github-project-grid">{projects.map((project) => {
        const relatedTools = (project.relatedToolIds ?? []).flatMap((toolId) => {
          const tool = getTool(toolId);
          return tool ? [tool] : [];
        });
        return (
          <article className="resource-site-card github-project-card" key={project.id}>
            <ResourceLogo logo={getGitHubProjectLogo(project)} mark={project.mark} tone={project.tone} name={project.name} />
            <div className="resource-card-copy">
              <h3>{project.name}</h3><p>{project.description}</p>
              <div className="resource-tags"><span className={`project-difficulty ${getGitHubDifficultyClass(project.difficulty)}`}>{project.difficulty}</span>{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
              {relatedTools.length > 0 && <div className="project-related-tools"><small>关联工具</small><div>{relatedTools.map((tool) => <BrowserNavigationLink href={`/tools/${tool.id}`} key={tool.id}>{tool.shortName}</BrowserNavigationLink>)}</div></div>}
            </div>
            <a href={getGitHubProjectUrl(project)} target="_blank" rel="noreferrer" aria-label={`打开 ${project.name} GitHub 仓库`}><small>github.com/{project.repository}</small><strong>查看项目 <span aria-hidden="true">↗</span></strong></a>
          </article>
        );
      })}</div> : <div className="resource-empty"><strong>没有匹配的项目</strong><p>可以尝试项目名、用途关键词，或切换到“全部”分类。</p></div>}
    </>
  );
}
