"use client";

import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";

import { BrowserNavigationLink } from "@/components/BrowserNavigationLink";
import { getQuestionCategory, questionCategories, questions, type QuestionCategoryId, type QuestionLink } from "@/data/questions";
import { matchesSearch } from "@/lib/search";

function QuestionResourceLink({ link }: { link: QuestionLink }) {
  if (link.href.startsWith("http")) return <a href={link.href} target="_blank" rel="noreferrer">{link.label}<span aria-hidden="true">↗</span></a>;
  return <BrowserNavigationLink href={link.href}>{link.label}<span aria-hidden="true">→</span></BrowserNavigationLink>;
}

export function QuestionDirectory() {
  const [categoryId, setCategoryId] = useState<"all" | QuestionCategoryId>("all");
  const [query, setQuery] = useState("");
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [pendingQuestionId, setPendingQuestionId] = useState<string | null>(null);
  const [searchPending, setSearchPending] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const resultCountRef = useRef<HTMLParagraphElement>(null);

  const filteredQuestions = useMemo(() => {
    const normalizedQuery = query.trim();
    return questions.filter((item) => {
      const category = getQuestionCategory(item.categoryId);
      const matchesCategory = categoryId === "all" || item.categoryId === categoryId;
      const matchesQuery = !normalizedQuery || matchesSearch({
        title: item.question,
        description: [item.answer, ...(item.steps ?? []), ...(item.code ?? [])].join(" "),
        keywords: `${item.keywords} ${category?.title ?? ""}`,
      }, normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [categoryId, query]);

  const featuredQuestions = questions.filter((item) => item.featured);

  useEffect(() => {
    function revealHashQuestion() {
      const questionId = window.location.hash.replace(/^#question-/, "");
      if (!questions.some((item) => item.id === questionId)) return;
      setCategoryId("all");
      setQuery("");
      setExpandedIds((current) => current.includes(questionId) ? current : [...current, questionId]);
    }
    revealHashQuestion();
    window.addEventListener("hashchange", revealHashQuestion);
    return () => window.removeEventListener("hashchange", revealHashQuestion);
  }, []);

  useEffect(() => {
    if (!pendingQuestionId) return;
    const frame = window.requestAnimationFrame(() => {
      const target = document.getElementById(`question-${pendingQuestionId}`);
      if (!target) return;
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      setPendingQuestionId(null);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [pendingQuestionId, categoryId, query]);

  useEffect(() => {
    if (!searchPending) return;
    const frame = window.requestAnimationFrame(() => {
      resultCountRef.current?.focus();
      resultCountRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      setSearchPending(false);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [searchPending, categoryId, query]);

  function toggleQuestion(questionId: string) {
    setExpandedIds((current) => current.includes(questionId) ? current.filter((id) => id !== questionId) : [...current, questionId]);
  }

  function revealQuestion(questionId: string) {
    setCategoryId("all");
    setQuery("");
    setExpandedIds((current) => current.includes(questionId) ? current : [...current, questionId]);
    setPendingQuestionId(questionId);
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!query.trim()) {
      searchInputRef.current?.focus();
      return;
    }
    setCategoryId("all");
    setSearchPending(true);
  }

  return (
    <>
      <section className="question-featured" aria-labelledby="featured-question-title">
        <div className="question-section-heading"><div><span className="section-kicker">高频入口</span><h2 id="featured-question-title">大家最常遇到</h2></div><p>先从这些问题开始，答案会带你回到对应工具、安装指南或官方来源。</p></div>
        <div className="question-featured-grid">{featuredQuestions.map((item, index) => {
          const category = getQuestionCategory(item.categoryId);
          return <button type="button" key={item.id} onClick={() => revealQuestion(item.id)}><span>{String(index + 1).padStart(2, "0")}</span><small>{category?.title}</small><strong>{item.question}</strong><b aria-hidden="true">→</b></button>;
        })}</div>
      </section>

      <section className="question-browser" aria-labelledby="question-browser-title">
        <div className="question-section-heading"><div><span className="section-kicker">分类查找</span><h2 id="question-browser-title">从问题出发找到下一步</h2></div><p>回答以新手能够执行的下一步为主，不替代产品官方条款、费用说明与技术文档。</p></div>

        <div className="question-controls">
          <form className="question-search-form" role="search" onSubmit={submitSearch}>
            <label className="question-search"><span aria-hidden="true">⌕</span><span className="sr-only">搜索常见问题</span><input ref={searchInputRef} type="search" value={query} onChange={(event) => { setQuery(event.target.value); if (event.target.value.trim()) setCategoryId("all"); }} placeholder="例如：终端怎么打开、API Key、如何订阅" /></label>
            <button className="question-search-submit" type="submit">搜索</button>
          </form>
          <div className="question-filters" aria-label="问题分类筛选"><button className={categoryId === "all" ? "active" : ""} type="button" onClick={() => setCategoryId("all")}>全部问题</button>{questionCategories.map((category) => <button className={categoryId === category.id ? "active" : ""} type="button" key={category.id} onClick={() => setCategoryId(category.id)}>{category.title}</button>)}</div>
        </div>

        <div className="question-category-summary">{questionCategories.map((category) => <button className={categoryId === category.id ? "active" : ""} type="button" key={category.id} onClick={() => setCategoryId(category.id)}><span>{category.mark}</span><strong>{category.title}</strong><small>{category.description}</small></button>)}</div>

        <p className="question-count" ref={resultCountRef} tabIndex={-1} aria-live="polite">当前显示 {filteredQuestions.length} 个问题{query.trim() ? ` · 搜索“${query.trim()}”` : ""}</p>
        {filteredQuestions.length > 0 ? <div className="question-list">{filteredQuestions.map((item) => {
          const expanded = expandedIds.includes(item.id);
          const category = getQuestionCategory(item.categoryId);
          const answerId = `question-answer-${item.id}`;
          return <article className={expanded ? "expanded" : ""} id={`question-${item.id}`} key={item.id}>
            <button className="question-toggle" type="button" aria-expanded={expanded} aria-controls={answerId} onClick={() => toggleQuestion(item.id)}><span><small>{category?.mark} · {category?.title}</small><strong>{item.question}</strong></span><b aria-hidden="true">{expanded ? "−" : "+"}</b></button>
            {expanded && <div className="question-answer" id={answerId}>
              <p>{item.answer}</p>
              {item.steps && <ol>{item.steps.map((step) => <li key={step}>{step}</li>)}</ol>}
              {item.code && <div className="question-code">{item.code.map((line) => <code key={line}>{line}</code>)}</div>}
              {item.notice && <aside className={`question-notice ${item.notice.tone}`}><strong>{item.notice.title}</strong><p>{item.notice.text}</p></aside>}
              {item.links && <div className="question-links">{item.links.map((link) => <QuestionResourceLink link={link} key={`${item.id}-${link.href}`} />)}</div>}
            </div>}
          </article>;
        })}</div> : <div className="resource-empty"><strong>没有找到匹配的问题</strong><p>可以缩短关键词，例如只搜索“Docker”“API”或“安装”。</p></div>}
      </section>
    </>
  );
}
