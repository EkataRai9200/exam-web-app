import { useRouteError } from "react-router-dom";

function ErrorPage() {
  let error = useRouteError() as any;
  console.error(error);
  return (
    <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-indigo-600">Oops</p>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          {error.statusText || error.message}
        </h1>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <a
            href={"#!"}
            onClick={() => {
              window.location.reload();
            }}
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Try Again
          </a>
          {/* <a href="#" className="text-sm font-semibold text-gray-900">
            Contact support <span aria-hidden="true">&rarr;</span>
          </a> */}
        </div>
      </div>
    </main>
  );
}

export default ErrorPage;
