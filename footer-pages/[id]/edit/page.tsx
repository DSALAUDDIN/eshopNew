import FooterPageForm from '@/components/footer-page-form'

interface EditFooterPageProps {
  params: {
    id: string
  }
}

export default function EditFooterPage({ params }: EditFooterPageProps) {
  return <FooterPageForm pageId={params.id} />
}
