import MaxWidthWrapper from "@/components/MaxWidthWrapper"

const PromisePage=()=>{
    return (
        <MaxWidthWrapper className='bg-white'>
            <div className='bg-white'>
                <div className='mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8'>
                    <p className='text-muted-foreground hover: text-black-900'>
                        We are a group of CUHK students doing a software engineering project. We hope this website is good, user friendly and full performed. Thanks for using our website.
                    </p>
                </div>
            </div>
        </MaxWidthWrapper>
    )
}

export default PromisePage