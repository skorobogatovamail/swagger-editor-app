import { getTranslations } from 'next-intl/server';

const resources = [
  {
    key: 'rsSchool',
    href: 'https://rs.school/',
  },
  {
    key: 'openApi',
    href: 'https://www.openapis.org/',
  },
  {
    key: 'swaggerUi',
    href: 'https://swagger.io/tools/swagger-ui/',
  },
] as const;

export default async function About() {
  const t = await getTranslations('About');

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-12">
      <section className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-zinc-950">{t('title')}</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-600">
          {t('projectDescription')}
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-zinc-950">
            {t('courseTitle')}
          </h2>
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            {t('courseDescription')}
          </p>
        </article>

        <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-zinc-950">
            {t('projectTitle')}
          </h2>
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            {t('projectDescription')}
          </p>
        </article>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-zinc-950">
          {t('teamTitle')}
        </h2>
        <div className="mt-4 rounded-xl border border-zinc-100 bg-zinc-50 p-5">
          <h3 className="text-lg font-semibold text-zinc-950">
            {t('memberName')}
          </h3>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            {t('memberRole')}
          </p>
          <a
            className="mt-4 inline-flex text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
            href="https://github.com/skorobogatovamail"
            rel="noreferrer"
            target="_blank"
          >
            {t('githubLabel')}
          </a>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-zinc-950">
            {t('technologiesTitle')}
          </h2>
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            {t('technologies')}
          </p>
        </article>

        <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-zinc-950">
            {t('resourcesTitle')}
          </h2>
          <ul className="mt-3 flex flex-col gap-2">
            {resources.map((resource) => (
              <li key={resource.key}>
                <a
                  className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
                  href={resource.href}
                  rel="noreferrer"
                  target="_blank"
                >
                  {t(resource.key)}
                </a>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}
