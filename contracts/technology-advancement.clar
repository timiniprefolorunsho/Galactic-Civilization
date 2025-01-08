;; Technology Advancement Contract

(define-map technologies
  uint
  {
    civilization-id: uint,
    name: (string-ascii 100),
    description: (string-utf8 1000),
    level: uint,
    discovery-block: uint
  }
)

(define-data-var technology-count uint u0)

(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_NOT_AUTHORIZED (err u403))
(define-constant ERR_INVALID_TECHNOLOGY (err u404))

(define-public (discover-technology (civilization-id uint) (name (string-ascii 100)) (description (string-utf8 1000)))
  (let
    (
      (technology-id (+ (var-get technology-count) u1))
      (civilization (unwrap! (contract-call? .civilization-management get-civilization civilization-id) ERR_INVALID_TECHNOLOGY))
    )
    (asserts! (is-eq tx-sender (get creator civilization)) ERR_NOT_AUTHORIZED)
    (map-set technologies
      technology-id
      {
        civilization-id: civilization-id,
        name: name,
        description: description,
        level: u1,
        discovery-block: block-height
      }
    )
    (var-set technology-count technology-id)
    (ok technology-id)
  )
)

(define-public (advance-technology (technology-id uint))
  (let
    (
      (technology (unwrap! (map-get? technologies technology-id) ERR_INVALID_TECHNOLOGY))
      (civilization (unwrap! (contract-call? .civilization-management get-civilization (get civilization-id technology)) ERR_INVALID_TECHNOLOGY))
    )
    (asserts! (is-eq tx-sender (get creator civilization)) ERR_NOT_AUTHORIZED)
    (ok (map-set technologies
      technology-id
      (merge technology { level: (+ (get level technology) u1) })
    ))
  )
)

(define-read-only (get-technology (technology-id uint))
  (map-get? technologies technology-id)
)

(define-read-only (get-technology-count)
  (var-get technology-count)
)

