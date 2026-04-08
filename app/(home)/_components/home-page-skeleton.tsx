export default function HomePageSkeleton() {
  return (
    <div className="animate-pulse">
      <section className="mb-4 grid grid-cols-[1fr_100px] items-center justify-between bg-white px-6 py-5">
        <div className="flex flex-col gap-3">
          <div className="h-5 w-40 rounded bg-gray-100" />
          <div className="h-8 w-28 rounded bg-gray-100" />
        </div>
        <div className="h-[100px] w-[100px] rounded-lg bg-gray-100" />
      </section>
      <section className="border-t-16 border-t-gray-100 bg-white pt-10">
        <div className="flex flex-col gap-4 px-6">
          <div className="flex justify-between">
            <div className="h-6 w-36 rounded bg-gray-100" />
            <div className="h-6 w-20 rounded bg-gray-100" />
          </div>
          <div className="flex flex-col gap-3">
            <div className="h-[72px] w-full rounded-lg bg-gray-100" />
            <div className="h-[72px] w-full rounded-lg bg-gray-100" />
          </div>
        </div>
      </section>
    </div>
  );
}
