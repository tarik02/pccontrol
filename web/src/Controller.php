<?php

namespace Tarik02\PccontrolWeb;

use Symfony\Component\Process\Process;

use Symfony\Component\HttpFoundation\{
    JsonResponse,
    Request,
    Response
};

/**
 * Class Controller
 * @package Tarik02\PccontrolWeb
 */
class Controller
{
    /**
     * @param Request $request
     * @return Response
     */
    public function handle(Request $request): Response
    {
        switch ($request->getPathInfo()) {
            case '/power/status':
                if (! $request->isMethod(Request::METHOD_GET)) {
                    return new Response('', Response::HTTP_METHOD_NOT_ALLOWED);
                }

                $process = Process::fromShellCommandline(
                    \getenv('PC_PING_CMD')
                );
                $process->run();

                $lines = \explode("\n", \trim($process->getOutput()));
                $line = $lines[1];

                return new JsonResponse([
                    'status' => empty($line) ? 'off' : 'on',
                ]);

            case '/power/wake':
                if (! $request->isMethod(Request::METHOD_POST)) {
                    return new Response('', Response::HTTP_METHOD_NOT_ALLOWED);
                }

                $process = Process::fromShellCommandline(
                    \getenv('PC_WAKE_CMD')
                );
                $process->run();

                return new JsonResponse();

            case '/power/sleep':
                if (! $request->isMethod(Request::METHOD_POST)) {
                    return new Response('', Response::HTTP_METHOD_NOT_ALLOWED);
                }

                $process = Process::fromShellCommandline(
                    \getenv('PC_SLEEP_CMD')
                );
                $process->run();

                return new JsonResponse();
        }

        return new Response('', Response::HTTP_NOT_FOUND);
    }
}
