<p style="text-align: center">
  <a href="https://github.com/tportio" target="blank"><img src="https://avatars.githubusercontent.com/u/20039087?s=200&v=4" alt="ONDA Logo" /></a>
</p>

# Email-Voucher-CMS

바우처 이메일을 파싱하여, 온다 허브로 전송합니다.


## Build Setup

```bash
# install dependencies
$ yarn

# 4602 포트에서 로컬로 개발 빌드 실행 (.env.example 내용에 필요한 환경변수 채워서 .env 파일로 저장해 두어야 실행 가능)
$ yarn start:local

or

$ sls offline --stage offline --httpPort 4602 --reloadHandler
다른 포트로 실행 필요할 시 위의 httpPort 인자값 수정

# OpenAPI 스펙 문서 자동 생성
$ yarn docs

생성 후 S3 동기화
$ yarn docs:sync

특정 람다 펑션 실행 테스트
$ serverless invoke local -f registerChannelEmail -p ./src/functions/registerChannelEmail/mock.json
-f 인자로 등록된 핸들러명, -p 인자로는 핸들러에 전달할 파라미터값 저장된 json 문서 경로 입력
```

## POSTMAN

워크스페이스중 `ONDA EVCMS` 선택

## 🌐 Port/URL

| Stage      | Domain                   |   port |
| ---------- | ------------------------ | -----: |
| local      | `localhost`              | `4602` |
| dev        | `api.evcms.tport.dev/ `  |  `443` |
| production | `api.evcms.tport.io/`    |  `443` |


## Directory structure
```
├── config
│   └── aws-iam-policy          # AWS 배포시 각 롤에 필요한 정책 스키마
│       └── ...
├── parsers                     # 공급사별 이메일 파싱 regexp 모음 
│   ├── coupang                 
│   │   ├── create.json
│   │   └── delete.json
│   └── ...
├── src
│   ├── apis
│   │   └── gds                 # GDS API 호출부
│   │       └── ...
│   ├── database
│   │   ├── models              # Mongoose 모델 디피니션
│   │   │   └── ...
│   │   └── index.js
│   ├── definitions             # 타입스크립트 타입 디피니션
│   │   ├── inputs              # 인풋 타입 / 인터페이스
│   │   │   └── ...
│   │   └── types               # 단순 타입 디피니션들
│   │       └── ...
│   ├── functions               # 람다 소스코드 및 컨피그
│   │   ├── addMotherEmailGroup
│   │   │   ├── handler.ts      # `addMotherEmailGroup` POST API 람다 핸들러 소스코드
│   │   │   ├── index.ts        # `addMotherEmailGroup` 서버리스 프레임워크 컨피그
│   │   │   ├── mock.json       # `addMotherEmailGroup` 로컬 테스트시 사용되는 mock 데이터
│   │   │   └── schema.ts       # `addMotherEmailGroup` 람다 입력 파라미터 스키마
│   │   ├── ...                 # 다른 엔드포인트도 위와 같은 구조를 따름
│   │   ├── watchLabels
│   │   │   ├── handler.ts      # `watchLabels` 스케줄링 잡 핸들러 소스코드
│   │   │   └── index.ts        # `watchLabels` 서버리스 프레임워크 컨피그
│   │   │
│   │   └── index.ts
│   │
│   └── libs                    # 공통 라이브러리
│       └── api-gateway.ts      
│       └── handler-resolver.ts
│       └── gmail-client.ts   
│       └── mongo-manager      
│       └── lambda.ts        
│       └── ...           
│
├── package.json
├── serverless.ts               # Serverless service file
├── tsconfig.json               # Typescript compiler configuration
├── tsconfig.paths.json         # Typescript paths
└── webpack.config.js           # Webpack configuration
```


[Notion TF Document](https://www.notion.so/onda/CMS-TF-5d34978d272d4a25bb6da785ceb2fca4)

[Tech Specs](https://www.notion.so/onda/CMS-6dc93ca602e042b99ffb7749a2c96b17)
