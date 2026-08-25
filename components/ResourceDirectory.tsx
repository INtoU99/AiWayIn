"use client";

import { useMemo, useState } from "react";

import { ResourceLogo } from "@/components/ResourceLogo";
import { featuredResources, resourceCategories } from "@/data/resources";

function normalize(value: string) {
  return value.trim().toLocaleLowerCase("zh-CN");
}

export function ResourceDirectory() {
  const [categoryId, setCategoryId] = useState("all");
  const [query, setQuery] = useState("");

  const resources = useMemo(() => {
    const normalizedQuery = normalize(query);
    return featuredResources.filter((resource) => {
      const matchesCategory = categoryId === "all" || resource.categoryId === categoryId;
      const searchable = `${resource.name} ${resource.description} ${resource.domain} ${resource.tags.join(" ")}`.toLocaleLowerCase("zh-CN");
      return matchesCategory && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [categoryId, query]);

  return (
    <>
      <div className="resource-controls">
        <label className="resource-search"><span aria-hidden="true">⌕</span><span className="sr-only">搜索精选网站</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索网站或用途" /></label>
        <div className="resource-filters" aria-label="网站分类筛选">
          <button className={categoryId === "all" ? "active" : ""} type="button" onClick={() => setCategoryId("all")}>全部</button>
          {resourceCategories.map((category) => <button className={categoryId === category.id ? "active" : ""} type="button" key={category.id} onClick={() => setCategoryId(category.id)}>{category.title}</button>)}
        </div>
      </div>

      <p className="resource-count" aria-live="polite">当前显示 {resources.length} 个网站</p>
      {resources.length > 0 ? <div className="resource-site-grid">{resources.map((resource) => (
        <article className="resource-site-card" key={resource.id}>
          <ResourceLogo logo={resource.logo} mark={resource.mark} tone={resource.tone} name={resource.name} />
          <div className="resource-card-copy"><h3>{resource.name}</h3><p>{resource.description}</p><div className="resource-tags">{resource.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div>
          <a href={resource.url} target="_blank" rel="noreferrer" aria-label={`访问 ${resource.name} 官方网站`}><small>{resource.domain}</small><strong>访问官网 <span aria-hidden="true">↗</span></strong></a>
        </article>
      ))}</div> : <div className="resource-empty"><strong>没有匹配的网站</strong><p>可以缩短关键词，或切换到“全部”分类后再次搜索。</p></div>}
    </>
  );
}
