import { useState } from 'react'
import { BookOpen, Plus, Search, Edit2, Trash2, Calendar, FileText } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import KnowledgeFormModal from '../components/KnowledgeFormModal'

export default function KnowledgePage() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [articleToEdit, setArticleToEdit] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const { data: articles, isLoading } = useQuery({
    queryKey: ['knowledge', searchQuery],
    queryFn: () => api.get('/knowledge', { params: { search: searchQuery } }).then(r => r.data),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/knowledge/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['knowledge'] })
  })

  const handleEdit = (article: any) => {
    setArticleToEdit(article)
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setArticleToEdit(null)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-[hsl(var(--foreground))]">قاعدة المعرفة</h2>
          <p className="text-[hsl(var(--muted))] mt-1">المستندات والأدلة الإرشادية الخاصة بالشركة</p>
        </div>
        <button onClick={handleAdd} className="btn-primary"><Plus size={16} /> مقالة جديدة</button>
      </div>

      <div className="relative max-w-2xl mx-auto mb-8">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-[hsl(var(--muted))]" size={20} />
        <input 
          type="text" 
          placeholder="ابحث في قاعدة المعرفة..." 
          className="w-full form-input h-14 pl-4 pr-12 text-lg rounded-2xl shadow-sm border-[hsl(var(--border))] focus:border-emerald-500 focus:ring-emerald-500/20"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="glass-card h-48 animate-pulse" />)}
        </div>
      ) : articles?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {articles.map((article: any) => (
            <div key={article.id} className="glass-card p-6 relative group hover:border-emerald-500/50 transition-colors">
              <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(article)} className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100">
                  <Edit2 size={14} />
                </button>
                <button 
                  onClick={() => {
                    if (window.confirm('هل أنت متأكد من حذف هذه المقالة؟')) deleteMutation.mutate(article.id)
                  }} 
                  className="p-1.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
                  <FileText size={24} />
                </div>
                <div className="pr-12">
                  <h3 className="font-bold text-lg text-[hsl(var(--foreground))]">{article.title}</h3>
                  <div className="text-sm text-[hsl(var(--muted))] flex items-center gap-2 mt-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${article.is_published ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                      {article.is_published ? 'منشورة' : 'مسودة'}
                    </span>
                    <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(article.created_at).toLocaleDateString('ar-AE')}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-[hsl(var(--muted))] line-clamp-3 leading-relaxed">
                {article.content}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center">
          <BookOpen size={48} className="mx-auto text-[hsl(var(--muted))] mb-4 opacity-20" />
          <h3 className="text-lg font-bold text-[hsl(var(--foreground))] mb-2">
            {searchQuery ? 'لم يتم العثور على نتائج' : 'لا توجد مقالات مسجلة بعد'}
          </h3>
          <p className="text-[hsl(var(--muted))] max-w-md mx-auto">
            {searchQuery ? 'حاول البحث بكلمات مختلفة' : 'قم بكتابة أدلة الاستخدام، السياسات، والمستندات الداخلية لمشاركتها مع فريقك.'}
          </p>
          {!searchQuery && (
            <button onClick={handleAdd} className="btn-primary mx-auto mt-6 px-6 py-2">أضف أول مقالة</button>
          )}
        </div>
      )}

      <KnowledgeFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        articleToEdit={articleToEdit}
      />
    </div>
  )
}

