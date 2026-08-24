import BottomSheet from './ui/BottomSheet'
import { useUiStore } from '../store/useUiStore'
import { getArticleById } from '../data/articles'
import './ArticleSheet.css'

export default function ArticleSheet() {
  const openArticleId = useUiStore((state) => state.openArticleId)
  const closeArticle = useUiStore((state) => state.closeArticle)
  const article = openArticleId ? getArticleById(openArticleId) : null

  return (
    <BottomSheet open={Boolean(article)} onClose={closeArticle} className="article-sheet">
      {article && (
        <>
          <button type="button" className="article-sheet__close" onClick={closeArticle} aria-label="Close article">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <div className="article-sheet__body">
            {article.image && (
              <div className="article-sheet__image-wrap">
                <img src={article.image} alt={article.title} className="article-sheet__image" loading="lazy" />
              </div>
            )}
            <span className="article-sheet__reading-time">{article.readingTime}</span>
            <h1>{article.title}</h1>
            {article.body.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </>
      )}
    </BottomSheet>
  )
}
