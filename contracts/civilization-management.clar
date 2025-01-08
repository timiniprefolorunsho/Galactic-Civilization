;; Civilization Management Contract

(define-data-var civilization-count uint u0)

(define-map civilizations
  uint
  {
    creator: principal,
    name: (string-ascii 100),
    description: (string-utf8 1000),
    parameters: (list 10 int),
    technology-level: uint,
    population: uint,
    resources: uint,
    status: (string-ascii 20)
  }
)

(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_NOT_AUTHORIZED (err u403))
(define-constant ERR_INVALID_CIVILIZATION (err u404))

(define-public (create-civilization (name (string-ascii 100)) (description (string-utf8 1000)) (parameters (list 10 int)))
  (let
    (
      (civilization-id (+ (var-get civilization-count) u1))
    )
    (map-set civilizations
      civilization-id
      {
        creator: tx-sender,
        name: name,
        description: description,
        parameters: parameters,
        technology-level: u1,
        population: u1000000,
        resources: u1000,
        status: "active"
      }
    )
    (var-set civilization-count civilization-id)
    (ok civilization-id)
  )
)

(define-public (update-civilization-status (civilization-id uint) (new-status (string-ascii 20)))
  (let
    (
      (civilization (unwrap! (map-get? civilizations civilization-id) ERR_INVALID_CIVILIZATION))
    )
    (asserts! (or (is-eq tx-sender CONTRACT_OWNER) (is-eq tx-sender (get creator civilization))) ERR_NOT_AUTHORIZED)
    (ok (map-set civilizations
      civilization-id
      (merge civilization { status: new-status })
    ))
  )
)

(define-public (update-civilization-parameters (civilization-id uint) (new-parameters (list 10 int)))
  (let
    (
      (civilization (unwrap! (map-get? civilizations civilization-id) ERR_INVALID_CIVILIZATION))
    )
    (asserts! (is-eq tx-sender (get creator civilization)) ERR_NOT_AUTHORIZED)
    (ok (map-set civilizations
      civilization-id
      (merge civilization { parameters: new-parameters })
    ))
  )
)

(define-read-only (get-civilization (civilization-id uint))
  (map-get? civilizations civilization-id)
)

(define-read-only (get-civilization-count)
  (var-get civilization-count)
)

